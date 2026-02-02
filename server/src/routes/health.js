const express = require("express");
const router = express.Router();

router.get("/health", async (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    uptime: {
      seconds: uptime,
      human: formatUptime(uptime),
    },
    memory: {
      used: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
      unit: "MB",
    },
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
    api: {
      version: process.env.API_VERSION || "v1",
      endpoints: ["health", "generate-pdf", "templates"],
    },
  });
});

router.get("/health/detailed", async (req, res) => {
  const healthChecks = {
    server: true,
    latex: await checkLatexInstallation(),
    filesystem: await checkFilesystemAccess(),
    memory: checkMemoryUsage(),
  };

  const allHealthy = Object.values(healthChecks).every(
    (status) => status === true,
  );

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    checks: healthChecks,
    details: {
      latex: healthChecks.latex
        ? "pdflatex available"
        : "LaTeX not installed - PDF generation will fail",
      filesystem: healthChecks.filesystem
        ? "temp directory accessible"
        : "Cannot access temp directory",
      memory: healthChecks.memory
        ? "Memory usage normal"
        : "High memory usage detected",
    },
  });
});

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m ${secs}s`;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
}

async function checkLatexInstallation() {
  try {
    const { exec } = require("child_process");
    const { promisify } = require("util");
    const execAsync = promisify(exec);

    await execAsync("pdflatex --version");
    return true;
  } catch {
    return false;
  }
}

async function checkFilesystemAccess() {
  try {
    const fs = require("fs").promises;
    const tempDir = path.join(__dirname, "../../temp");

    await fs.mkdir(tempDir, { recursive: true });
    await fs.access(tempDir, require("fs").constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function checkMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  const usedMB = memoryUsage.heapUsed / 1024 / 1024;

  return usedMB < 500;
}

module.exports = router;
