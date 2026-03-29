import express from "express";
import { usersStorage, clientsStorage, invoicesStorage, paymentsStorage } from "../utils/jsonStorage.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET dashboard stats
router.get("/", auth, (req, res) => {
  try {
    const userId = req.user.userId;

    // Get stats for current user
    const userClients = clientsStorage.find({ userId });
    const userInvoices = invoicesStorage.find({ userId });
    const userPayments = paymentsStorage.find({ userId });

    // Calculate totals
    const totalRevenue = userPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalInvoices = userInvoices.length;
    const totalClients = userClients.length;
    const totalPayments = userPayments.length;

    // Recent invoices (last 5)
    const recentInvoices = userInvoices
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    // Monthly revenue (simplified)
    const monthlyRevenue = totalRevenue; // Could be enhanced with date filtering

    res.json({
      stats: {
        totalRevenue,
        totalInvoices,
        totalClients,
        totalPayments,
        monthlyRevenue
      },
      recentInvoices,
      recentClients: userClients.slice(0, 5)
    });
  } catch (error) {
    console.error("Erreur GET /dashboard:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;