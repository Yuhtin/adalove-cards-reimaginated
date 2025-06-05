const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');
const authController = require('../controllers/authController');

// Apply authentication middleware to all routes
router.use(authController.verifyToken);

router.get('/', sectionController.getAllSections);
router.get('/:id', sectionController.getSectionById);
router.post('/', sectionController.createSection);
router.put('/:id', sectionController.updateSection);
router.delete('/:id', sectionController.deleteSection);
router.get('/:id/activities', sectionController.getSectionActivities);
router.post('/import-adalove', sectionController.importFromAdaLove);

module.exports = router; 