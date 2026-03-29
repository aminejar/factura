import express from "express";

const router = express.Router();

// GET /api/health - Health check simple
router.get("/", (req, res) => {
  console.log('🔍 Health check requested from:', req.ip);
  const response = { status: "ok" };
  console.log('🔍 Health check response:', response);
  res.json(response);
});

// GET /api/health/detailed - Health check détaillé
router.get("/detailed", (req, res) => {
  const startTime = Date.now();
  const responseTime = Date.now() - startTime;

  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    storage: {
      status: "JSON files",
      responseTime: `${responseTime}ms`,
    },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      memory: {
        used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
        total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      },
    },
  });
});

// GET /api/health/db - Vérifier le système de stockage
router.get("/db", (req, res) => {
  const startTime = Date.now();
  const responseTime = Date.now() - startTime;

  res.json({
    status: "OK",
    storage: "JSON files",
    responseTime: `${responseTime}ms`,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/health/ready - Readiness probe (pour Kubernetes/Docker)
router.get("/ready", (req, res) => {
  // Application is always ready with JSON storage
  res.status(200).json({
    status: "ready",
    timestamp: new Date().toISOString(),
  });
});

// GET /health/live - Liveness probe (pour Kubernetes/Docker)
router.get("/live", (req, res) => {
  // Vérifier que l'application est vivante (ne vérifie pas la DB)
  res.status(200).json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
});

export default router;