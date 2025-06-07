const Card = require('../models/cardModel');
const ActivityType = require('../models/activityTypeModel');
const StatusType = require('../models/statusTypeModel');

const getAllCards = async (req, res) => {
  try {
    const cards = await Card.getAll();
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCardById = async (req, res) => {
  try {
    const card = await Card.getById(req.params.id);
    if (card) {
      res.status(200).json(card);
    } else {
      res.status(404).json({ error: 'Card not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserCards = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const cards = await Card.getByUserId(userId);
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCard = async (req, res) => {
  try {
    const cardData = {
      ...req.body,
      userId: req.body.userId || req.user.id
    };
    
    const newCard = await Card.create(cardData);
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCard = async (req, res) => {
  try {
    const cardData = { ...req.body };
    const updatedCard = await Card.update(req.params.id, cardData);
    
    if (updatedCard) {
      res.status(200).json(updatedCard);
    } else {
      res.status(404).json({ error: 'Card not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCardStatus = async (req, res) => {
  try {
    const { statusTypeId } = req.body;
    
    if (!statusTypeId) {
      return res.status(400).json({ error: 'Status type ID is required' });
    }
    
    const updatedCard = await Card.updateStatus(req.params.id, statusTypeId);
    
    if (updatedCard) {
      res.status(200).json(updatedCard);
    } else {
      res.status(404).json({ error: 'Card not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCard = async (req, res) => {
  try {
    const deleted = await Card.delete(req.params.id);
    
    if (deleted) {
      res.status(200).json({ message: 'Card deleted successfully' });
    } else {
      res.status(404).json({ error: 'Card not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCardsByFilters = async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId || req.user.id,
      activityTypeId: req.query.activityTypeId,
      statusTypeId: req.query.statusTypeId,
      mandatory: req.query.mandatory === 'true' ? true : 
                req.query.mandatory === 'false' ? false : undefined,
      weekNumber: req.query.weekNumber,
      instructorName: req.query.instructorName,
      dateFrom: req.query.dateFrom,
      dateTo: req.query.dateTo,
      searchTerm: req.query.search,
      orderBy: req.query.orderBy,
      orderDirection: req.query.orderDirection || 'ASC',
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined
    };
    
    const cards = await Card.getCardsByFilters(filters);
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCardStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const stats = await Card.getCardStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const importCards = async (req, res) => {
  try {
    const { cards } = req.body;
    const userId = req.user.id;

    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({ error: 'Cards array is required' });
    }

    const importedCards = await Card.bulkImportFromExternalSource(cards, userId);

    res.status(201).json({
      message: `${importedCards.length} cards imported successfully`,
      importedCount: importedCards.length,
      cards: importedCards
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const importFromAdaLove = async (req, res) => {
  try {
    const adaloveData = req.body;
    const userId = req.user.id;

    // Validate AdaLove JSON structure
    if (!adaloveData.activities || !Array.isArray(adaloveData.activities)) {
      return res.status(400).json({
        error: 'Invalid AdaLove JSON format. Expected "activities" array.'
      });
    }

    // Extract activities from the official AdaLove response
    const activities = adaloveData.activities;

    // Import each activity
    const importedCards = await Card.bulkImportFromExternalSource(activities, userId);

    // Extract section info for context
    const sectionInfo = adaloveData.section ? {
      sectionCaption: adaloveData.section.sectionCaption,
      projectCaption: adaloveData.section.projectCaption,
      advisorName: adaloveData.section.advisorName
    } : null;

    res.status(201).json({
      message: `Successfully imported ${importedCards.length} activities from AdaLove`,
      importedCount: importedCards.length,
      totalActivities: activities.length,
      skippedCount: activities.length - importedCards.length,
      sectionInfo: sectionInfo,
      cards: importedCards
    });
  } catch (error) {
    console.error('AdaLove import error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAllActivityTypes = async (req, res) => {
  try {
    const types = await ActivityType.getAll();
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllStatusTypes = async (req, res) => {
  try {
    const types = await StatusType.getAll();
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCards,
  getCardById,
  getUserCards,
  createCard,
  updateCard,
  updateCardStatus,
  deleteCard,
  getCardsByFilters,
  getCardStats,
  importCards,
  importFromAdaLove,
  getAllActivityTypes,
  getAllStatusTypes
};