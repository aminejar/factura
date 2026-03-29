import express from "express";
import { invoicesStorage, clientsStorage } from "../utils/jsonStorage.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// BUSINESS LOGIC: Calculate invoice status based on payment progress and due date
// Ensures consistent status calculation across the entire application
// SINGLE SOURCE OF TRUTH for invoice status calculation
//
// Rules (strict priority order):
// 1. If explicitly marked as uncollectible → UNCOLLECTIBLE
// 2. If totalPaidAmount >= invoiceTotal → PAID
// 3. If dueDate < today AND totalPaidAmount < invoiceTotal → OVERDUE
// 4. If totalPaidAmount > 0 AND totalPaidAmount < invoiceTotal → PARTIALLY_PAID
// 5. If dueDate >= today AND totalPaidAmount == 0 → OPEN
// 6. Default fallback → OPEN
function calculateInvoiceStatus(invoice) {
  const totalPaidAmount = invoice.paidAmount || 0;
  const invoiceTotal = invoice.total || 0;

  // Rule 1: Explicitly marked as uncollectible
  if (invoice.status === 'uncollectible' || invoice.status === 'void') {
    return 'uncollectible';
  }

  // Rule 2: Fully paid (totalPaidAmount >= invoiceTotal)
  if (totalPaidAmount >= invoiceTotal) {
    return 'paid';
  }

  // Rule 3: Overdue (dueDate < today AND totalPaidAmount < invoiceTotal)
  if (invoice.dueDate) {
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();

    // Remove time part for date comparison
    const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (todayOnly > dueDateOnly && totalPaidAmount < invoiceTotal) {
      return 'overdue';
    }
  }

  // Rule 4: Partially paid (totalPaidAmount > 0 AND totalPaidAmount < invoiceTotal)
  if (totalPaidAmount > 0 && totalPaidAmount < invoiceTotal) {
    return 'partially_paid';
  }

  // Rule 5: Open (dueDate >= today AND totalPaidAmount == 0)
  if (invoice.dueDate) {
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();

    const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (todayOnly <= dueDateOnly && totalPaidAmount === 0) {
      return 'open';
    }
  }

  // Rule 6: Default fallback (covers edge cases)
  return 'open';
}

// GET all invoices
router.get("/", auth, (req, res) => {
  try {
    const invoices = invoicesStorage.getAll();

    // Transform invoices to match frontend expectations
    const transformedInvoices = invoices.map(invoice => {
      // Get client information
      let clientNom = 'Unknown';
      let client = null;
      try {
        if (invoice.clientId) {
          client = clientsStorage.findById(invoice.clientId);
          if (client) {
            clientNom = client.name;
          }
        }
      } catch (err) {
        console.log('Could not fetch client for invoice:', invoice.id);
      }

      const paidAmount = invoice.paidAmount || 0;
      const totalAmount = invoice.total || 0;
      const remainingAmount = Math.max(0, totalAmount - paidAmount);

      return {
        id: invoice.id,
        numero: invoice.number,
        client_nom: clientNom,
        client_email: client ? client.email : '',
        montant_ttc: totalAmount,
        montant_ht: totalAmount ? totalAmount / 1.2 : 0, // Approximate HT (excluding 20% VAT)
        montant_tva: totalAmount ? totalAmount - (totalAmount / 1.2) : 0, // Approximate TVA
        montant_paye: paidAmount, // Amount already paid
        montant_restant: remainingAmount, // Amount still due
        statut: calculateInvoiceStatus(invoice),
        date: invoice.date,
        dueDate: invoice.dueDate,
        items: invoice.items || [],
        notes: invoice.notes || '',
        created_at: invoice.createdAt
      };
    });

    res.json(transformedInvoices);
  } catch (error) {
    console.error("Erreur GET /invoices:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET single invoice by ID
router.get("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const invoice = invoicesStorage.findById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    // Get client information
    let clientNom = 'Unknown';
    let client = null;
    try {
      if (invoice.clientId) {
        client = clientsStorage.findById(invoice.clientId);
        if (client) {
          clientNom = client.name;
        }
      }
    } catch (err) {
      console.log('Could not fetch client for invoice:', invoice.id);
    }

    const paidAmount = invoice.paidAmount || 0;
    const totalAmount = invoice.total || 0;
    const remainingAmount = Math.max(0, totalAmount - paidAmount);

    // Transform invoice to match frontend expectations
    const transformedInvoice = {
      id: invoice.id,
      numero: invoice.number,
      client_nom: clientNom,
      client_email: client ? client.email : '',
      montant_ttc: totalAmount,
      montant_ht: totalAmount ? totalAmount / 1.2 : 0, // Approximate HT (excluding 20% VAT)
      montant_tva: totalAmount ? totalAmount - (totalAmount / 1.2) : 0, // Approximate TVA
      montant_paye: paidAmount, // Amount already paid
      montant_restant: remainingAmount, // Amount still due
      statut: calculateInvoiceStatus(invoice),
      date: invoice.date,
      dueDate: invoice.dueDate,
      items: invoice.items || [],
      notes: invoice.notes || '',
      created_at: invoice.createdAt
    };

    res.json(transformedInvoice);
  } catch (error) {
    console.error("Erreur GET /invoices/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// CREATE invoice
router.post("/", auth, (req, res) => {
  try {
    const { number, date, dueDate, paymentTermsDays, clientId, items, total, status } = req.body;

    if (!number || !date || !clientId || !items || !total) {
      return res.status(400).json({ error: "Tous les champs requis doivent être fournis" });
    }

    // Calculate due date if not provided but payment terms are given
    let finalDueDate = dueDate;
    if (!finalDueDate && paymentTermsDays) {
      const invoiceDate = new Date(date);
      const calculatedDueDate = new Date(invoiceDate);
      calculatedDueDate.setDate(invoiceDate.getDate() + parseInt(paymentTermsDays));
      finalDueDate = calculatedDueDate.toISOString().split('T')[0];
    }

    if (!finalDueDate) {
      return res.status(400).json({ error: "Une date d'échéance doit être fournie ou des conditions de paiement doivent être spécifiées" });
    }

    // Validate due date is not before invoice date
    const invoiceDate = new Date(date);
    const dueDateObj = new Date(finalDueDate);
    if (dueDateObj < invoiceDate) {
      return res.status(400).json({ error: "La date d'échéance ne peut pas être antérieure à la date de la facture" });
    }

    const invoice = invoicesStorage.create({
      number,
      date,
      invoiceDate: date, // Store both for clarity
      dueDate: finalDueDate,
      clientId,
      items,
      total: parseFloat(total),
      status: status || 'draft',
      paidAmount: 0, // Track how much has been paid
      remainingAmount: parseFloat(total), // Track remaining amount to pay
      userId: req.user.userId
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Erreur POST /invoices:", error);
    res.status(500).json({ error: "Erreur lors de la création" });
  }
});

// UPDATE invoice
router.put("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Get the current invoice to preserve existing data
    const currentInvoice = invoicesStorage.findById(id);
    if (!currentInvoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    // Merge updates with existing data
    const mergedUpdates = { ...currentInvoice, ...updates };

    // If total amount is being updated, recalculate remaining amount
    if (updates.total !== undefined) {
      const newTotal = parseFloat(updates.total);
      const currentPaid = currentInvoice.paidAmount || 0;
      mergedUpdates.remainingAmount = Math.max(0, newTotal - currentPaid);
    }

    const updatedInvoice = invoicesStorage.update(id, mergedUpdates);

    if (!updatedInvoice) {
      return res.status(404).json({ error: "Erreur lors de la mise à jour" });
    }

    // Return the updated invoice with transformed data (same as GET endpoint)
    let clientNom = 'Unknown';
    try {
      if (updatedInvoice.clientId) {
        const client = clientsStorage.findById(updatedInvoice.clientId);
        if (client) {
          clientNom = client.name;
        }
      }
    } catch (err) {
      console.log('Could not fetch client for updated invoice:', updatedInvoice.id);
    }

    const paidAmount = updatedInvoice.paidAmount || 0;
    const totalAmount = updatedInvoice.total || 0;
    const remainingAmount = Math.max(0, totalAmount - paidAmount);

    const transformedInvoice = {
      id: updatedInvoice.id,
      numero: updatedInvoice.number,
      client_nom: clientNom,
      client_email: updatedInvoice.clientId ? (clientsStorage.findById(updatedInvoice.clientId)?.email || '') : '',
      montant_ttc: totalAmount,
      montant_ht: totalAmount ? totalAmount / 1.2 : 0,
      montant_tva: totalAmount ? totalAmount - (totalAmount / 1.2) : 0,
      montant_paye: paidAmount,
      montant_restant: remainingAmount,
      statut: calculateInvoiceStatus(updatedInvoice),
      date: updatedInvoice.date,
      dueDate: updatedInvoice.dueDate,
      items: updatedInvoice.items || [],
      userId: updatedInvoice.userId
    };

    res.json(transformedInvoice);
  } catch (error) {
    console.error("Erreur PUT /invoices/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// CANCEL invoice - safe alternative to deletion
router.patch("/:id/cancel", auth, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const invoice = invoicesStorage.findById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    // Mark as canceled instead of deleting
    const updated = invoicesStorage.update(id, {
      status: 'void',
      notes: invoice.notes ? `${invoice.notes}\n[CANCELED: ${reason || 'User canceled'}]` : `[CANCELED: ${reason || 'User canceled'}]`
    });

    res.json({
      message: "Facture annulée avec succès",
      invoice: updated
    });
  } catch (error) {
    console.error("Erreur PATCH /invoices/:id/cancel:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// VOID payment - safe alternative to deletion
router.patch("/:id/void", auth, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const payment = paymentsStorage.findById(id);
    if (!payment) {
      return res.status(404).json({ error: "Paiement non trouvé" });
    }

    // Mark as voided instead of deleting
    const updated = paymentsStorage.update(id, {
      status: 'voided',
      notes: payment.notes ? `${payment.notes}\n[VOIDED: ${reason || 'User voided'}]` : `[VOIDED: ${reason || 'User voided'}]`
    });

    // Recalculate invoice amounts if payment was linked to invoice
    if (payment.invoiceId && payment.status === 'completed') {
      try {
        const invoice = invoicesStorage.findById(payment.invoiceId);
        if (invoice) {
          // Subtract the voided payment from paid amount
          const newPaidAmount = Math.max(0, (invoice.paidAmount || 0) - payment.amount);
          const newRemainingAmount = Math.max(0, invoice.total - newPaidAmount);

          invoicesStorage.update(payment.invoiceId, {
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount
          });
        }
      } catch (invoiceError) {
        console.error('Error recalculating invoice after payment void:', invoiceError);
      }
    }

    res.json({
      message: "Paiement annulé avec succès",
      payment: updated,
      recalculatedInvoice: payment.invoiceId ? true : false
    });
  } catch (error) {
    console.error("Erreur PATCH /payments/:id/void:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE invoice - with accounting safety rules
router.delete("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;

    // Get invoice details before deletion
    const invoice = invoicesStorage.findById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    // Accounting safety rules
    // 1. Invoices with any payments cannot be deleted
    if (invoice.paidAmount && invoice.paidAmount > 0) {
      return res.status(400).json({
        error: "Invoices with payments cannot be deleted for accounting safety. Use cancel or void instead."
      });
    }

    // 2. Only draft invoices can be deleted
    if (invoice.status !== 'draft') {
      return res.status(400).json({
        error: "Only draft invoices can be deleted. Use cancel or void for other statuses."
      });
    }

    // Delete the invoice
    const deleted = invoicesStorage.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }

    res.json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    console.error("Erreur DELETE /invoices/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;