import express from "express";
import { clientsStorage, invoicesStorage } from "../utils/jsonStorage.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET all clients (protected)
router.get("/", auth, (req, res) => {
  try {
    const clients = clientsStorage.getAll();

    // Filter clients by user (each user represents a company)
    const userId = req.user.userId;
    console.log('🔍 GET CLIENTS - Filtering by userId:', userId);

    const filteredClients = clients.filter(client => client.userId === userId);

    // Transform to frontend expected format with calculated revenue
    const transformedClients = filteredClients.map(client => {
      // Calculate real revenue from customer's invoices
      const customerInvoices = invoicesStorage.find({ clientId: client.id });
      const totalRevenue = customerInvoices?.reduce((sum, invoice) => {
        const value = Number(invoice.total);
        return sum + (isNaN(value) ? 0 : value);
      }, 0) || 0;

      const totalInvoices = customerInvoices?.length || 0;

      return {
        id: client.id,
        nom: client.name || 'Unknown Customer',
        email: client.email,
        telephone: client.phone,
        adresse: client.address,
        ville: '',
        code_postal: '',
        pays: '',
        siret: '',
        tva: '',
        created_at: client.createdAt,
        totalInvoices,
        totalRevenue
      };
    });

    console.log('🔍 GET CLIENTS - Returning', transformedClients.length, 'clients for company', userId);

    res.json(transformedClients);
  } catch (error) {
    console.error("Erreur GET /clients:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET single client by ID
router.get("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const client = clientsStorage.findById(id);
    if (!client) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    // Check if client belongs to user's company
    const userId = req.user.userId;
    if (client.userId !== userId) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    // Calculate real revenue from customer's invoices
    const customerInvoices = invoicesStorage.find({ clientId: id });
    const totalRevenue = customerInvoices?.reduce((sum, invoice) => {
      const value = Number(invoice.total);
      return sum + (isNaN(value) ? 0 : value);
    }, 0) || 0;

    const totalInvoices = customerInvoices?.length || 0;

    // Transform to frontend expected format
    const transformedClient = {
      id: client.id,
      nom: client.name || 'Unknown Customer',
      email: client.email,
      telephone: client.phone,
      adresse: client.address,
      ville: '',
      code_postal: '',
      pays: '',
      siret: '',
      tva: '',
      created_at: client.createdAt,
      totalInvoices,
      totalRevenue
    };

    console.log('🔍 CUSTOMER REVENUE CALCULATION:', {
      customerId: id,
      invoiceCount: customerInvoices?.length || 0,
      totalRevenue,
      invoices: customerInvoices?.map(inv => ({ id: inv.id, total: inv.total }))
    });

    res.json(transformedClient);
  } catch (error) {
    console.error("Erreur GET /clients/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// CREATE client
router.post("/", auth, (req, res) => {
  try {
    const { name, email, phone, address, company, companyId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Le nom est requis" });
    }

    // Use authenticated user ID as company identifier
    const userId = req.user.userId;

    console.log('🔍 CREATE CLIENT - Using userId as company identifier:', userId);

    const client = clientsStorage.create({
      name,
      email,
      phone,
      address,
      company,
      userId: userId,
      companyId: userId // User ID serves as company ID
    });

    console.log('🔍 CREATE CLIENT - Client created for user/company:', userId);

    // Transform to frontend expected format
    const transformedClient = {
      id: client.id,
      nom: client.name || 'Unknown Customer',
      email: client.email,
      telephone: client.phone,
      adresse: client.address,
      ville: '',
      code_postal: '',
      pays: '',
      siret: '',
      tva: '',
      created_at: client.createdAt
    };

    res.status(201).json(transformedClient);
  } catch (error) {
    console.error("Erreur POST /clients:", error);
    res.status(500).json({ error: "Erreur lors de la création" });
  }
});

// UPDATE client
router.put("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, company } = req.body;

    const updatedClient = clientsStorage.update(id, {
      name,
      email,
      phone,
      address,
      company
    });

    if (!updatedClient) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    res.json(updatedClient);
  } catch (error) {
    console.error("Erreur PUT /clients/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE client
router.delete("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = clientsStorage.delete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Client non trouvé" });
    }

    res.json({ message: "Client supprimé avec succès" });
  } catch (error) {
    console.error("Erreur DELETE /clients/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;