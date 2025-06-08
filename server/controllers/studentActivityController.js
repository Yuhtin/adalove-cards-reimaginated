const StudentActivity = require('../models/studentActivityModel');

const getAllStudentActivities = async (req, res) => {
  try {
    const studentActivities = await StudentActivity.getAll();
    res.status(200).json(studentActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentActivityById = async (req, res) => {
  try {
    const studentActivity = await StudentActivity.getById(req.params.id);
    if (studentActivity) {
      res.status(200).json(studentActivity);
    } else {
      res.status(404).json({ error: 'Student activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserStudentActivities = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const studentActivities = await StudentActivity.getByUserId(userId);
    res.status(200).json(studentActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStudentActivity = async (req, res) => {
  try {
    const studentActivityData = {
      ...req.body,
      userId: req.body.userId || req.user.id
    };
    
    const newStudentActivity = await StudentActivity.create(studentActivityData);
    res.status(201).json(newStudentActivity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStudentActivity = async (req, res) => {
  try {
    const updatedStudentActivity = await StudentActivity.update(req.params.id, req.body);
    
    if (updatedStudentActivity) {
      res.status(200).json(updatedStudentActivity);
    } else {
      res.status(404).json({ error: 'Student activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStudentActivityStatus = async (req, res) => {
  try {
    const { statusTypeId } = req.body;
    
    if (!statusTypeId) {
      return res.status(400).json({ error: 'Status type ID is required' });
    }
    
    const updatedStudentActivity = await StudentActivity.updateStatus(req.params.id, statusTypeId);
    
    if (updatedStudentActivity) {
      res.status(200).json(updatedStudentActivity);
    } else {
      res.status(404).json({ error: 'Student activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudentActivity = async (req, res) => {
  try {
    const deleted = await StudentActivity.delete(req.params.id);
    
    if (deleted) {
      res.status(200).json({ message: 'Student activity deleted successfully' });
    } else {
      res.status(404).json({ error: 'Student activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentActivitiesByFilters = async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId || req.user.id,
      activityTypeId: req.query.activityTypeId,
      statusTypeId: req.query.statusTypeId,
      mandatory: req.query.mandatory === 'true' ? true : 
                req.query.mandatory === 'false' ? false : undefined,
      weekNumber: req.query.weekNumber,
      instructorName: req.query.instructorName,
      searchTerm: req.query.search,
      limit: req.query.limit ? parseInt(req.query.limit) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined
    };
    
    const studentActivities = await StudentActivity.getActivitiesByFilters(filters);
    res.status(200).json(studentActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentActivityStats = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const stats = await StudentActivity.getStudentActivityStats(userId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllActivityTypes = async (req, res) => {
  try {
    const ActivityType = require('../models/activityTypeModel');
    const types = await ActivityType.getAll();
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllStatusTypes = async (req, res) => {
  try {
    const StatusType = require('../models/statusTypeModel');
    const types = await StatusType.getAll();
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChartsData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weekFilter } = req.query;

    // Get activities with optional week filter
    let whereClause = 'sa.userId = $1';
    let params = [userId];

    if (weekFilter && weekFilter !== 'all') {
      whereClause += ' AND a.weekNumber = $2';
      params.push(parseInt(weekFilter));
    }

    // Weekly progress data
    const weeklyProgressQuery = `
      SELECT
        a.weekNumber,
        COUNT(*) as total,
        COUNT(CASE WHEN st.name = 'Feito' THEN 1 END) as completed,
        COUNT(CASE WHEN st.name = 'Fazendo' THEN 1 END) as inProgress,
        COUNT(CASE WHEN st.name = 'A fazer' THEN 1 END) as pending
      FROM student_activities sa
      JOIN activities a ON sa.activityId = a.id
      JOIN status_types st ON sa.statusTypeId = st.id
      WHERE ${whereClause}
      GROUP BY a.weekNumber
      ORDER BY a.weekNumber ASC
    `;

    // Activity type distribution
    const typeDistributionQuery = `
      SELECT
        at.name as activityType,
        COUNT(*) as count,
        COUNT(CASE WHEN st.name = 'Feito' THEN 1 END) as completed
      FROM student_activities sa
      JOIN activities a ON sa.activityId = a.id
      JOIN activity_types at ON a.activityTypeId = at.id
      JOIN status_types st ON sa.statusTypeId = st.id
      WHERE ${whereClause}
      GROUP BY at.name
      ORDER BY count DESC
    `;

    // Monthly completion trend
    const monthlyTrendQuery = `
      SELECT
        DATE_TRUNC('month', a.date) as month,
        COUNT(*) as total,
        COUNT(CASE WHEN st.name = 'Feito' THEN 1 END) as completed
      FROM student_activities sa
      JOIN activities a ON sa.activityId = a.id
      JOIN status_types st ON sa.statusTypeId = st.id
      WHERE ${whereClause}
      GROUP BY DATE_TRUNC('month', a.date)
      ORDER BY month ASC
    `;

    const [weeklyProgress, typeDistribution, monthlyTrend] = await Promise.all([
      require('../config/db').query(weeklyProgressQuery, params),
      require('../config/db').query(typeDistributionQuery, params),
      require('../config/db').query(monthlyTrendQuery, params)
    ]);

    res.status(200).json({
      weeklyProgress: weeklyProgress.rows,
      typeDistribution: typeDistribution.rows,
      monthlyTrend: monthlyTrend.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bulkDeleteActivities = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all student activities for the user
    const result = await require('../config/db').query(
      'DELETE FROM student_activities WHERE userId = $1',
      [userId]
    );

    res.status(200).json({
      message: 'All activities deleted successfully',
      deletedCount: result.rowCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStudentActivities,
  getStudentActivityById,
  getUserStudentActivities,
  createStudentActivity,
  updateStudentActivity,
  updateStudentActivityStatus,
  deleteStudentActivity,
  getStudentActivitiesByFilters,
  getStudentActivityStats,
  getAllActivityTypes,
  getAllStatusTypes,
  getChartsData,
  bulkDeleteActivities
};