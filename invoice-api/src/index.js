import dotenv from 'dotenv';
dotenv.config();

// Load environment variables
const DEFAULT_PORT = 5006; // Port fixe pour éviter les conflits
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

// Debug: Log environment variables
console.log('🔍 Environment variables loaded:');
console.log('PORT:', process.env.PORT || `defaulting to ${DEFAULT_PORT}`);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');
console.log('📁 Using JSON file storage (no database)');

import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/auth.js";
import healthRoutes from "./routes/health.js";
import userRoutes from "./routes/users.js";
import companyRoutes from "./routes/company.js";
import clientRoutes from "./routes/clients.js";
import productRoutes from "./routes/products.js";
import invoiceRoutes from "./routes/invoices.js";
import paymentRoutes from "./routes/payments.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();


// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/dashboard", dashboardRoutes);


// Route par défaut
app.get("/", (req, res) => {
  res.json({
    message: "API de gestion de factures",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      users: "/users",
      clients: "/clients",
      products: "/products",
      invoices: "/invoices",
      payments: "/payments",
    },
  });
});

// Function to find an available port starting from the requested one
const findAvailablePort = async (startPort) => {
  const net = await import('net');
  const server = net.createServer();

  return new Promise((resolve, reject) => {
    server.listen(startPort, () => {
      server.close(() => resolve(startPort));
    });

    server.on('error', () => {
      // Port is busy, try next one
      resolve(findAvailablePort(startPort + 1));
    });
  });
};

// Start the server with automatic port finding
const startServer = async () => {
  try {
    const requestedPort = parseInt(process.env.PORT) || 5001;
    console.log(`🔍 Checking port ${requestedPort}...`);

    const availablePort = await findAvailablePort(requestedPort);

    if (availablePort !== requestedPort) {
      console.log(`⚠️  Port ${requestedPort} is busy, using ${availablePort} instead`);
      console.log(`💡 Tip: Set PORT=${availablePort} in your .env file to use this port permanently`);
    }

    const server = app.listen(availablePort, () => {
      console.log(`
╔══════════════════════════════════════╗
║        🚀 SERVER STARTED 🚀          ║
║                                      ║
║  Port: ${availablePort}                          ║
║  URL: http://localhost:${availablePort}          ║
║  Storage: JSON Files 📁              ║
║                                      ║
║  Routes registered:                  ║
║  • /api/health                       ║
║  • /api/auth                         ║
║  • /api/users                        ║
║  • /api/clients                      ║
║  • /api/products                     ║
║  • /api/invoices                     ║
║  • /api/payments                     ║
║  • /api/dashboard                    ║
╚══════════════════════════════════════╝
      `);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${availablePort} is still in use. Please try a different port.`);
        console.log(`💡 Try: PORT=${availablePort + 1} npm run dev`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();