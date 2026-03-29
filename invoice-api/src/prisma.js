// Mock Prisma client for JSON storage compatibility
// This provides a Prisma-like interface but uses JSON files as storage

import { invoicesStorage, clientsStorage, paymentsStorage, usersStorage, productsStorage } from './utils/jsonStorage.js';

// Mock Prisma client
const prisma = {
  invoice: {
    findMany: async ({ where = {}, include = {}, orderBy }) => {
      try {
        let invoices = invoicesStorage.getAll();
        console.log('Invoices findMany - Initial invoices:', invoices.length);
        console.log('Invoices findMany - Where clause:', JSON.stringify(where));

        // Filter by userId if provided
        if (where.userId) {
          console.log('Filtering invoices by userId:', where.userId);
          invoices = invoices.filter(inv => inv.userId === where.userId);
          console.log('Invoices after userId filter:', invoices.length);
        }

        // Filter by status if provided
        if (where.status) {
          if (where.status.in) {
            invoices = invoices.filter(inv => where.status.in.includes(inv.status));
          } else {
            invoices = invoices.filter(inv => inv.status === where.status);
          }
        }

        // Include related data
        if (include.customer) {
          invoices = invoices.map(invoice => ({
            ...invoice,
            customer: clientsStorage.findById(invoice.customerId) || null
          }));
        }

        if (include.payments) {
          invoices = invoices.map(invoice => ({
            ...invoice,
            payments: paymentsStorage.getAll().filter(p => p.invoiceId === invoice.id)
          }));
        }

        // Sort by createdAt desc if requested
        if (orderBy?.createdAt === 'desc') {
          invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return invoices;
      } catch (error) {
        console.error('Prisma invoice.findMany error:', error);
        throw error;
      }
    },

    findUnique: async ({ where, include = {} }) => {
      try {
        const invoice = invoicesStorage.findById(where.id);
        if (!invoice) return null;

        let result = { ...invoice };

        // Include related data
        if (include.customer) {
          result.customer = clientsStorage.findById(invoice.customerId) || null;
        }

        if (include.payments) {
          result.payments = paymentsStorage.getAll().filter(p => p.invoiceId === invoice.id);
        }

        if (include.user) {
          result.user = usersStorage.findById(invoice.userId) || null;
        }

        return result;
      } catch (error) {
        console.error('Prisma invoice.findUnique error:', error);
        throw error;
      }
    },

    create: async ({ data, include = {} }) => {
      try {
        // Convert Prisma data format to JSON storage format
        const invoiceData = {
          number: data.invoiceNumber,
          date: data.issueDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          dueDate: data.dueDate?.toISOString().split('T')[0] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          clientId: data.customerId,
          items: data.items || '[]',
          total: data.total,
          subtotal: data.subtotal || data.total,
          tax: data.tax || 0,
          status: data.status || 'DRAFT',
          notes: data.notes || '',
          userId: data.userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const invoice = invoicesStorage.create(invoiceData);

        let result = { ...invoice };

        // Include related data
        if (include.customer) {
          result.customer = clientsStorage.findById(invoice.clientId) || null;
        }

        if (include.payments) {
          result.payments = [];
        }

        return result;
      } catch (error) {
        console.error('Prisma invoice.create error:', error);
        throw error;
      }
    },

    update: async ({ where, data }) => {
      try {
        const updateData = { ...data };

        // Handle date conversions
        if (updateData.issueDate) {
          updateData.date = updateData.issueDate.toISOString().split('T')[0];
          delete updateData.issueDate;
        }
        if (updateData.dueDate) {
          updateData.dueDate = updateData.dueDate.toISOString().split('T')[0];
        }

        // Add updatedAt timestamp
        updateData.updatedAt = new Date().toISOString();

        return invoicesStorage.update(where.id, updateData);
      } catch (error) {
        console.error('Prisma invoice.update error:', error);
        throw error;
      }
    },

    delete: async ({ where }) => {
      try {
        return invoicesStorage.delete(where.id);
      } catch (error) {
        console.error('Prisma invoice.delete error:', error);
        throw error;
      }
    },

    count: async ({ where = {} }) => {
      try {
        let invoices = invoicesStorage.getAll();

        if (where.userId) {
          invoices = invoices.filter(inv => inv.userId === where.userId);
        }

        return invoices.length;
      } catch (error) {
        console.error('Prisma invoice.count error:', error);
        throw error;
      }
    }
  },

  payment: {
    findMany: async ({ where = {}, include = {}, orderBy }) => {
      try {
        let payments = paymentsStorage.getAll();
        console.log('Payments findMany - Initial payments:', payments.length);
        console.log('Payments findMany - Where clause:', JSON.stringify(where));

        // Filter by userId directly on payments
        if (where.userId) {
          console.log('Filtering by userId:', where.userId);
          payments = payments.filter(p => p.userId === where.userId);
          console.log('Payments after userId filter:', payments.length);
        }

        // Filter by invoiceId if provided
        if (where.invoiceId) {
          payments = payments.filter(p => p.invoiceId === where.invoiceId);
        }

        // Filter by invoice.userId if provided (alternative way)
        if (where.invoice?.userId) {
          payments = payments.filter(p => {
            const invoice = invoicesStorage.findById(p.invoiceId);
            return invoice && invoice.userId === where.invoice.userId;
          });
        }

        // Include related data
        if (include.invoice) {
          payments = payments.map(payment => ({
            ...payment,
            invoice: invoicesStorage.findById(payment.invoiceId) || null
          }));

          // Further include customer if requested
          if (include.invoice.include?.customer) {
            payments = payments.map(payment => ({
              ...payment,
              invoice: payment.invoice ? {
                ...payment.invoice,
                customer: clientsStorage.findById(payment.invoice.customerId) || null
              } : null
            }));
          }
        }

        // Sort by createdAt desc if requested
        if (orderBy?.createdAt === 'desc') {
          payments.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        return payments;
      } catch (error) {
        console.error('Prisma payment.findMany error:', error);
        throw error;
      }
    },

    findUnique: async ({ where, include = {} }) => {
      try {
        const payment = paymentsStorage.findById(where.id);
        if (!payment) return null;

        let result = { ...payment };

        // Include related data
        if (include.invoice) {
          result.invoice = invoicesStorage.findById(payment.invoiceId) || null;

          // Further include customer if requested
          if (include.invoice.include?.customer) {
            result.invoice = result.invoice ? {
              ...result.invoice,
              customer: clientsStorage.findById(result.invoice.customerId) || null
            } : null;
          }

          // Further include payments if requested
          if (include.invoice.include?.payments) {
            result.invoice = result.invoice ? {
              ...result.invoice,
              payments: paymentsStorage.getAll().filter(p => p.invoiceId === result.invoice.id)
            } : null;
          }

          // Further include user if requested
          if (include.invoice.include?.user) {
            result.invoice = result.invoice ? {
              ...result.invoice,
              user: usersStorage.findById(result.invoice.userId) || null
            } : null;
          }
        }

        return result;
      } catch (error) {
        console.error('Prisma payment.findUnique error:', error);
        throw error;
      }
    },

    create: async ({ data, include = {} }) => {
      try {
        const paymentData = {
          invoiceId: data.invoiceId,
          amount: data.amount,
          method: data.method,
          date: data.date || new Date().toISOString().split('T')[0],
          userId: data.userId,
          createdAt: new Date().toISOString()
        };

        const payment = paymentsStorage.create(paymentData);

        let result = { ...payment };

        // Include related data
        if (include.invoice) {
          result.invoice = invoicesStorage.findById(payment.invoiceId) || null;

          if (include.invoice.include?.customer) {
            result.invoice = result.invoice ? {
              ...result.invoice,
              customer: clientsStorage.findById(result.invoice.customerId) || null
            } : null;
          }
        }

        return result;
      } catch (error) {
        console.error('Prisma payment.create error:', error);
        throw error;
      }
    },

    update: async ({ where, data }) => {
      try {
        return paymentsStorage.update(where.id, data);
      } catch (error) {
        console.error('Prisma payment.update error:', error);
        throw error;
      }
    },

    delete: async ({ where }) => {
      try {
        return paymentsStorage.delete(where.id);
      } catch (error) {
        console.error('Prisma payment.delete error:', error);
        throw error;
      }
    }
  },

  customer: {
    findMany: async ({ where = {} }) => {
      try {
        let customers = clientsStorage.getAll();

        if (where.userId) {
          customers = customers.filter(c => c.userId === where.userId);
        }

        return customers;
      } catch (error) {
        console.error('Prisma customer.findMany error:', error);
        throw error;
      }
    },

    findUnique: async ({ where }) => {
      try {
        return clientsStorage.findById(where.id) || null;
      } catch (error) {
        console.error('Prisma customer.findUnique error:', error);
        throw error;
      }
    },

    findFirst: async ({ where }) => {
      try {
        const customers = clientsStorage.getAll();
        return customers.find(c =>
          (!where.id || c.id === where.id) &&
          (!where.userId || c.userId === where.userId)
        ) || null;
      } catch (error) {
        console.error('Prisma customer.findFirst error:', error);
        throw error;
      }
    },

    create: async ({ data }) => {
      try {
        const customerData = {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          address: data.address || null,
          userId: data.userId,
          createdAt: new Date().toISOString()
        };

        return clientsStorage.create(customerData);
      } catch (error) {
        console.error('Prisma customer.create error:', error);
        throw error;
      }
    },

    update: async ({ where, data }) => {
      try {
        return clientsStorage.update(where.id, data);
      } catch (error) {
        console.error('Prisma customer.update error:', error);
        throw error;
      }
    },

    delete: async ({ where }) => {
      try {
        return clientsStorage.delete(where.id);
      } catch (error) {
        console.error('Prisma customer.delete error:', error);
        throw error;
      }
    }
  },

  user: {
    findUnique: async ({ where }) => {
      try {
        return usersStorage.findById(where.id) || null;
      } catch (error) {
        console.error('Prisma user.findUnique error:', error);
        throw error;
      }
    },

    findFirst: async ({ where }) => {
      try {
        const users = usersStorage.getAll();
        return users.find(u => u.email === where.email) || null;
      } catch (error) {
        console.error('Prisma user.findFirst error:', error);
        throw error;
      }
    },

    create: async ({ data }) => {
      try {
        const userData = {
          name: data.name,
          email: data.email,
          password: data.password,
          company: data.company || null,
          createdAt: new Date().toISOString()
        };

        return usersStorage.create(userData);
      } catch (error) {
        console.error('Prisma user.create error:', error);
        throw error;
      }
    },

    update: async ({ where, data }) => {
      try {
        return usersStorage.update(where.id, data);
      } catch (error) {
        console.error('Prisma user.update error:', error);
        throw error;
      }
    }
  },

  product: {
    findMany: async ({ where = {} }) => {
      try {
        let products = productsStorage.getAll();

        if (where.userId) {
          products = products.filter(p => p.userId === where.userId);
        }

        return products;
      } catch (error) {
        console.error('Prisma product.findMany error:', error);
        throw error;
      }
    },

    create: async ({ data }) => {
      try {
        const productData = {
          name: data.name,
          description: data.description || null,
          price: data.price,
          userId: data.userId,
          createdAt: new Date().toISOString()
        };

        return productsStorage.create(productData);
      } catch (error) {
        console.error('Prisma product.create error:', error);
        throw error;
      }
    }
  }
};

export default prisma;

