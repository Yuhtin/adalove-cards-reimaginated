const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const authController = require('../controllers/authController');

// Apply authentication middleware to all routes
router.use(authController.verifyToken);

router.get('/activity-types', cardController.getAllActivityTypes);
router.get('/status-types', cardController.getAllStatusTypes);
router.get('/', cardController.getCardsByFilters);
router.get('/stats', cardController.getCardStats);
router.get('/:id', cardController.getCardById);
router.post('/', cardController.createCard);
router.put('/:id', cardController.updateCard);
router.patch('/:id/status', cardController.updateCardStatus);
router.delete('/:id', cardController.deleteCard);
router.post('/import', cardController.importCards);

module.exports = router;