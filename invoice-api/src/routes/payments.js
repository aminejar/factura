
import express from "express";
import { paymentsStorage, clientsStorage, invoicesStorage } from "../utils/jsonStorage.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/**
 * Helper: normalize a payment object for frontend
 */
function normalizePayment(payment) {
  return {
    ...payment,
    // Normalize field names for frontend compatibility
    mode_paiement: payment.method || payment.mode_paiement || "virement",
    montant: typeof payment.amount === "number" ? payment.amount : payment.montant,
  };
}

/**
 * GET /api/payments
 * Return all payments enriched with client name and invoice number
 */
router.get("/", auth, (req, res) => {
  try {
    const payments = paymentsStorage.getAll();
    const enrichedPayments = payments.map((payment) => {
      let clientNom = null;
      let invoiceNumero = null;
      if (payment.invoiceId) {
        try {
          const invoice = invoicesStorage.findById(payment.invoiceId);
          if (invoice) {
            invoiceNumero = invoice.number;
            const client = clientsStorage.findById(invoice.clientId);
            if (client) clientNom = client.name;
          }
        } catch (err) {
          console.log("Could not enrich payment with invoice/client data:", payment.id);
        }
      }
      const norm = normalizePayment(payment);
      return { ...norm, client_nom: clientNom, invoice_numero: invoiceNumero };
    });
    res.json(enrichedPayments);
  } catch (error) {
    console.error("Erreur GET /payments:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * GET /api/payments/invoice/:invoiceId
 * Return payments for a specific invoice
 */
router.get("/invoice/:invoiceId", auth, (req, res) => {
  try {
    const { invoiceId } = req.params;
    const allPayments = paymentsStorage.getAll();
    const invoicePayments = allPayments.filter((p) => p.invoiceId === invoiceId);
    const normalized = invoicePayments.map((p) => normalizePayment(p));
    res.json(normalized);
  } catch (error) {
    console.error("Erreur GET /payments/invoice/:invoiceId:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * GET /api/payments/:id
 * Return a single payment
 */
router.get("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const payment = paymentsStorage.findById(id);
    if (!payment) return res.status(404).json({ error: "Paiement non trouvé" });
    res.json(normalizePayment(payment));
  } catch (error) {
    console.error("Erreur GET /payments/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * POST /api/payments
 * Create payment:
 * - existing invoice (invoiceId provided)
 * - existing client + new invoice (auto_create_invoice + client_id) with optional invoice_items
 * - new client + new invoice (auto_create_invoice + client fields) with optional invoice_items
 */
router.post("/", auth, (req, res) => {
  try {
    console.log("🔍 PAYMENT CREATION - Raw request body:", req.body);

    // Handle both English and French field names
    const amount = req.body.amount ?? req.body.montant;
    const method = req.body.method ?? req.body.mode_paiement;
    let paymentDate = req.body.date_paiement ?? req.body.payment_date;
    const reference = req.body.reference ?? null;
    const notes = req.body.notes ?? null;
    const invoiceIdBody = req.body.invoice_id ?? req.body.invoiceId ?? null;
    const status = req.body.status ?? "completed"; // default

    // Default payment date
    if (!paymentDate) {
      paymentDate = new Date().toISOString().split("T")[0];
    }

    // Basic validations
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({ error: "Le montant doit être un nombre positif supérieur à zéro" });
    }
    if (!method || String(method).trim() === "") {
      return res.status(400).json({ error: "La méthode de paiement est requise" });
    }
    // Validate payment date: not in the future
    if (paymentDate) {
      const paymentDateObj = new Date(paymentDate);
      const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
      if (paymentDateObj > todayEnd) {
        return res.status(400).json({ error: "La date de paiement ne peut pas être dans le futur" });
      }
    }

    const autoCreateInvoice = !!req.body.auto_create_invoice;

    // Optional items for invoice creation
    const rawItems = Array.isArray(req.body.invoice_items) ? req.body.invoice_items : null;

    // Normalize & validate invoice items
    let normalizedItems = null;
    if (rawItems) {
      normalizedItems = rawItems
        .map((it) => {
          const quantity = parseInt(it.quantity ?? 0);
          const unitPrice = parseFloat(it.unit_price ?? it.price ?? 0);
          const name = it.name ?? it.description ?? "Item";
          const productId = it.product_id ?? it.productId ?? null;
          if (isNaN(quantity) || quantity <= 0) return null;
          if (isNaN(unitPrice) || unitPrice <= 0) return null;
          const total = quantity * unitPrice;
          return {
            productId,
            description: name,
            quantity,
            unitPrice,
            total,
          };
        })
        .filter(Boolean);
      if (!normalizedItems || normalizedItems.length === 0) normalizedItems = null;
    }

    const clientInfo = autoCreateInvoice
      ? {
          name: req.body.client_nom,
          email: req.body.client_email,
          phone: req.body.client_telephone,
          address: req.body.client_adresse,
          company: req.body.client_nom,
        }
      : null;

    const clientIdFromBody = req.body.client_id ?? req.body.clientId ?? null;
    const invoiceDescription = req.body.invoice_description ?? "Auto-generated invoice";
    const dueDateFromBody = req.body.due_date ?? null;

    console.log("🔍 PAYMENT CREATION - Processed fields:", {
      amount, method, invoiceId: invoiceIdBody, autoCreateInvoice, clientIdFromBody,
      itemsProvided: !!normalizedItems
    });

    let finalInvoiceId = invoiceIdBody;
    let createdClient = null;
    let createdInvoice = null;
    let autoInvoiceCreated = false;

    // ---- Auto-create flow (existing client OR new client) ----
    if (autoCreateInvoice) {
      let clientIdToUse = null;

      if (clientIdFromBody) {
        const existingClient = clientsStorage.findById(clientIdFromBody);
        if (!existingClient) {
          return res.status(400).json({ error: "Client not found (client_id invalid)" });
        }
        clientIdToUse = existingClient.id;
        createdClient = existingClient;
      } else {
        // Create a new client
        if (!clientInfo?.name || !clientInfo?.email) {
          return res.status(400).json({ error: "Client name and email are required for auto creation" });
        }
        createdClient = clientsStorage.create({
          name: clientInfo.name,
          email: clientInfo.email,
          phone: clientInfo.phone || null,
          address: clientInfo.address || null,
          company: clientInfo.company,
          userId: req.user.userId,
          companyId: req.user.userId,
        });
        clientIdToUse = createdClient.id;
        console.log("🔍 PAYMENT CREATION - Client created:", createdClient.id);
      }

      // Compute invoice total:
      // If items provided, sum item totals; else use invoice_montant or fall back to payment amount
      let invoiceTotal = 0;
      let itemsForInvoice = [];

      if (normalizedItems) {
        invoiceTotal = normalizedItems.reduce((sum, it) => sum + it.total, 0);
        itemsForInvoice = normalizedItems;
      } else {
        invoiceTotal = req.body.invoice_montant ? parseFloat(req.body.invoice_montant) : parseFloat(amount);
        itemsForInvoice = [
          {
            description: `Service rendu - ${invoiceDescription}`,
            quantity: 1,
            unitPrice: invoiceTotal,
            total: invoiceTotal,
          }
        ];
      }

      if (isNaN(invoiceTotal) || invoiceTotal <= 0) {
        return res.status(400).json({ error: "Veuillez fournir un montant de facture valide" });
      }
      if (invoiceTotal < parseFloat(amount)) {
        return res.status(400).json({ error: "Le montant de la facture ne peut pas être inférieur au paiement" });
      }

      // Due date
      const now = new Date();
      let dueDateString = null;
      if (dueDateFromBody) {
        const dd = new Date(dueDateFromBody);
        dueDateString = dd.toISOString().split("T")[0];
      } else {
        const paymentTermsDays = parseInt(req.body.payment_terms) || 30;
        const dd = new Date(now);
        dd.setDate(now.getDate() + paymentTermsDays);
        dueDateString = dd.toISOString().split("T")[0];
      }

      // Generate invoice number
      const invoiceNumber = `INV-${Date.now()}`;

      // Create invoice
      createdInvoice = invoicesStorage.create({
        number: invoiceNumber,
        date: now.toISOString().split("T")[0],
        invoiceDate: now.toISOString().split("T")[0],
        dueDate: dueDateString,
        clientId: clientIdToUse,
        items: itemsForInvoice,
        total: invoiceTotal,
        status: "draft",
        paidAmount: parseFloat(amount),
        remainingAmount: Math.max(0, invoiceTotal - parseFloat(amount)),
        userId: req.user.userId,
      });

      finalInvoiceId = createdInvoice.id;
      autoInvoiceCreated = true;

      console.log("🔍 PAYMENT CREATION - Invoice created:", createdInvoice.id, "number:", createdInvoice.number);
    }

    // ---- Create payment record ----
    const payment = paymentsStorage.create({
      amount: parseFloat(amount),
      method,
      mode_paiement: method,
      montant: parseFloat(amount),
      status,
      invoiceId: finalInvoiceId || null,
      paymentDate,
      reference,
      notes,
      userId: req.user.userId,
      createdAt: new Date().toISOString(),
    });

    console.log("🔍 PAYMENT CREATION - Payment created:", payment.id, "linked to invoice:", finalInvoiceId);

    // ---- If payment targets an existing invoice (no auto-create), update invoice tracking ----
    if (finalInvoiceId && !autoInvoiceCreated) {
      try {
        const existingInvoice = invoicesStorage.findById(finalInvoiceId);
        if (!existingInvoice) {
          return res.status(404).json({ error: "Facture non trouvée" });
        }
        if (existingInvoice.status === "paid") {
          return res.status(400).json({ error: "Cannot add payment to an already fully paid invoice" });
        }
        if (existingInvoice.status === "void") {
          return res.status(400).json({ error: "Cannot add payment to a cancelled invoice" });
        }

        const paidAmount = existingInvoice.paidAmount || 0;
        const totalAmount = existingInvoice.total || 0;
        if (paidAmount < totalAmount && existingInvoice.dueDate) {
          const dueDate = new Date(existingInvoice.dueDate);
          const currentDate = new Date();
          const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
          const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
          if (currentDateOnly > dueDateOnly) {
            return res.status(400).json({ error: "Cannot add payment to an uncollectible invoice (past due date)" });
          }
        }

        const invoiceTotal = existingInvoice.total || 0;
        const currentPaidAmount = existingInvoice.paidAmount || 0;
        const newPaidAmount = currentPaidAmount + parseFloat(amount);

        const remainingBeforePayment = Math.max(0, invoiceTotal - currentPaidAmount);
        if (parseFloat(amount) > remainingBeforePayment) {
          return res.status(400).json({
            error: `Payment amount (${amount} TND) cannot exceed remaining balance (${remainingBeforePayment.toFixed(2)} TND)`,
          });
        }
        if (parseFloat(amount) > invoiceTotal) {
          return res.status(400).json({
            error: `Payment amount (${amount} TND) cannot exceed invoice total (${invoiceTotal} TND)`,
          });
        }

        const newRemainingAmount = Math.max(0, invoiceTotal - newPaidAmount);

        invoicesStorage.update(finalInvoiceId, {
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount,
        });

        console.log("🔍 PAYMENT CREATION - Updated existing invoice:", finalInvoiceId);
      } catch (err) {
        console.error("🔍 PAYMENT CREATION - Failed to update existing invoice:", err);
        return res.status(500).json({ error: "Erreur lors de la mise à jour de la facture" });
      }
    }

    // ---- Compute final status for existing-invoice flow (optional metadata) ----
    let finalInvoiceStatus = undefined;
    if (finalInvoiceId && !autoInvoiceCreated) {
      try {
        const finalInvoice = invoicesStorage.findById(finalInvoiceId);
        if (finalInvoice) {
          const paidAmount = finalInvoice.paidAmount || 0;
          const totalAmount = finalInvoice.total || 0;
          if (totalAmount === 0) {
            finalInvoiceStatus = "unpaid";
          } else if (paidAmount >= totalAmount) {
            finalInvoiceStatus = "paid";
          } else {
            const d = finalInvoice.dueDate ? new Date(finalInvoice.dueDate) : null;
            if (d) {
              const current = new Date();
              const dOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
              const cOnly = new Date(current.getFullYear(), current.getMonth(), current.getDate());
              finalInvoiceStatus = cOnly > dOnly ? "overdue" : "unpaid";
            } else {
              finalInvoiceStatus = "unpaid";
            }
          }
        }
      } catch (statusError) {
        console.error("Error calculating final invoice status:", statusError);
      }
    }

    // ---- Response payload ----
    const responseData = {
      ...normalizePayment(payment),
      montant: parseFloat(amount),
      auto_invoice_created: autoInvoiceCreated,
      client_nom: createdClient?.name,
      invoice_numero: createdInvoice?.number,
      invoiceStatus: finalInvoiceStatus,
      invoice_total: autoInvoiceCreated
        ? (createdInvoice?.total ?? parseFloat(req.body.invoice_montant ?? amount))
        : undefined,
      invoice_paid: autoInvoiceCreated ? parseFloat(amount) : undefined,
      invoice_remaining: autoInvoiceCreated
        ? Math.max(0, (createdInvoice?.total ?? parseFloat(req.body.invoice_montant ?? amount)) - parseFloat(amount))
        : undefined,
    };

    console.log("🔍 PAYMENT CREATION - Response data:", {
      payment_id: payment.id,
      payment_montant: responseData.montant,
      auto_invoice_created: autoInvoiceCreated,
      invoice_total: responseData.invoice_total,
    });

    return res.status(201).json(responseData);
  } catch (error) {
    console.error("Erreur POST /payments:", error);
    res.status(500).json({ error: "Erreur lors de la création" });
  }
});

/**
 * PUT /api/payments/:id
 * Update payment (simple pass-through)
 */
router.put("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedPayment = paymentsStorage.update(id, updates);
    if (!updatedPayment) return res.status(404).json({ error: "Paiement non trouvé" });
    res.json(updatedPayment);
  } catch (error) {
    console.error("Erreur PUT /payments/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * PATCH /api/payments/:id/void
 * Safe void payment with invoice recalculation
 */
router.patch("/:id/void", auth, (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const payment = paymentsStorage.findById(id);
    if (!payment) return res.status(404).json({ error: "Paiement non trouvé" });

    const updated = paymentsStorage.update(id, {
      status: "voided",
      notes: payment.notes
        ? `${payment.notes}\n[VOIDED: ${reason ?? "User voided"}]`
        : `[VOIDED: ${reason ?? "User voided"}]`,
    });

    // Recalculate invoice amounts if payment was linked and previously completed
    if (payment.invoiceId && payment.status === "completed") {
      try {
        const invoice = invoicesStorage.findById(payment.invoiceId);
        if (invoice) {
          const newPaidAmount = Math.max(0, (invoice.paidAmount ?? 0) - (payment.amount ?? 0));
          const newRemainingAmount = Math.max(0, (invoice.total ?? 0) - newPaidAmount);
          invoicesStorage.update(payment.invoiceId, {
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
          });
        }
      } catch (invoiceError) {
        console.error("Error recalculating invoice after payment void:", invoiceError);
      }
    }

    res.json({
      message: "Paiement annulé avec succès",
      payment: updated,
      recalculatedInvoice: !!payment.invoiceId,
    });
  } catch (error) {
    console.error("Erreur PATCH /payments/:id/void:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * DELETE /api/payments/:id
 * Accounting safety: cannot delete completed payments
 */
router.delete("/:id", auth, (req, res) => {
  try {
    const { id } = req.params;
    const payment = paymentsStorage.findById(id);
    if (!payment) return res.status(404).json({ error: "Paiement non trouvé" });
    if (payment.status === "completed") {
      return res.status(400).json({
        error: "Completed payments cannot be deleted for accounting safety. Use void or refund instead.",
      });
    }

    const deleted = paymentsStorage.delete(id);
    if (!deleted) return res.status(404).json({ error: "Paiement non trouvé" });

    // Recalculate invoice if this payment was linked
    if (payment.invoiceId) {
      try {
        const invoice = invoicesStorage.findById(payment.invoiceId);
        if (invoice) {
          const allPayments = paymentsStorage.getAll().filter((p) => p.invoiceId === payment.invoiceId);
          const newPaidAmount = allPayments.reduce((sum, p) => sum + (p.amount ?? 0), 0);
          const newRemainingAmount = Math.max(0, (invoice.total ?? 0) - newPaidAmount);
          invoicesStorage.update(payment.invoiceId, {
            paidAmount: newPaidAmount,
            remainingAmount: newRemainingAmount,
          });
        }
      } catch (invoiceError) {
        console.error("Error recalculating invoice after payment deletion:", invoiceError);
        // don't fail deletion
      }
    }

    res.json({
      message: "Paiement supprimé avec succès",
      recalculatedInvoice: !!payment.invoiceId,
    });
  } catch (error) {
    console.error("Erreur DELETE /payments/:id:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
