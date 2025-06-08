const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const dataImportController = require('../controllers/dataImportController');

// Rate limiting for import endpoints
const importLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 import requests per windowMs
  message: {
    message: 'Too many import requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// All routes require authentication
router.use(authController.verifyToken);

// POST /api/data/import - Upload and start import
router.post('/import', 
  importLimiter,
  dataImportController.upload.single('file'),
  dataImportController.importData
);

// GET /api/data/import-status/:jobId - Get import job status
router.get('/import-status/:jobId', dataImportController.getImportStatus);

// GET /api/data/statistics - Get import statistics
router.get('/statistics', dataImportController.getStatistics);

// GET /api/data/import-history - Get import history
router.get('/import-history', dataImportController.getImportHistory);

// POST /api/data/cancel-import/:jobId - Cancel import job
router.post('/cancel-import/:jobId', dataImportController.cancelImport);

module.exports = router;
