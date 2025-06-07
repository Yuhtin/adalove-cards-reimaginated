const express = require('express');
const router = express.Router();
const studentActivityController = require('../controllers/studentActivityController');
const authController = require('../controllers/authController');

// Apply authentication middleware to all routes
router.use(authController.verifyToken);

// Type routes (no auth needed for these)
router.get('/activity-types', studentActivityController.getAllActivityTypes);
router.get('/status-types', studentActivityController.getAllStatusTypes);

router.get('/', studentActivityController.getStudentActivitiesByFilters);
router.get('/stats', studentActivityController.getStudentActivityStats);
router.get('/all', studentActivityController.getAllStudentActivities);
router.get('/:id', studentActivityController.getStudentActivityById);
router.post('/', studentActivityController.createStudentActivity);
router.put('/:id', studentActivityController.updateStudentActivity);
router.patch('/:id/status', studentActivityController.updateStudentActivityStatus);
router.delete('/:id', studentActivityController.deleteStudentActivity);

module.exports = router; 