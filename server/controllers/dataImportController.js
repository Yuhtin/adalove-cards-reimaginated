const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file extension and MIME type
    const allowedExtensions = ['.json'];
    const allowedMimeTypes = ['application/json', 'text/json'];

    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'), false);
    }
  }
});

// Sanitize input to prevent XSS and SQL injection
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .replace(/[<>]/g, '') // Remove < and > characters
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/['";]/g, '') // Remove quotes and semicolons
    .trim();
};

// Validate AdaLove 1.0 official export structure
const validateAdaLove1Structure = (data) => {
  const errors = [];

  if (!data || typeof data !== 'object') {
    errors.push('Formato de dados inválido');
    return { isValid: false, errors };
  }

  // Check for official AdaLove 1.0 export structure
  if (data.activities && Array.isArray(data.activities)) {
    if (data.activities.length === 0) {
      errors.push('Nenhuma atividade encontrada no arquivo');
    } else {
      // Validate activity structure from official export
      const firstActivity = data.activities[0];
      const requiredFields = ['studentActivityUuid', 'caption', 'professorName'];

      for (const field of requiredFields) {
        if (!(field in firstActivity)) {
          errors.push(`Campo obrigatório ausente: ${field}`);
        }
      }
    }
  } else if (Array.isArray(data)) {
    // Fallback: direct array of activities
    if (data.length === 0) {
      errors.push('Arquivo vazio - nenhuma atividade encontrada');
    } else {
      const firstActivity = data[0];
      const requiredFields = ['studentActivityUuid', 'caption', 'professorName'];

      for (const field of requiredFields) {
        if (!(field in firstActivity)) {
          errors.push(`Campo obrigatório ausente: ${field}`);
        }
      }
    }
  } else {
    errors.push('Estrutura não reconhecida - esperado export oficial do AdaLove 1.0');
  }

  const estimatedRecords = data.activities ? data.activities.length :
                          (Array.isArray(data) ? data.length : 0);

  return {
    isValid: errors.length === 0,
    errors,
    estimatedRecords
  };
};

// Create import job record
const createImportJob = async (userId, filename, fileSize, estimatedRecords) => {
  const jobId = uuidv4();

  const query = `
    INSERT INTO import_jobs (id, user_id, filename, file_size, estimated_records, status, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, NOW())
    RETURNING *
  `;

  const result = await db.query(query, [
    jobId,
    userId,
    sanitizeInput(filename),
    fileSize,
    estimatedRecords,
    'processing'
  ]);

  return result.rows[0];
};

// Update import job status
const updateImportJob = async (jobId, status, recordsProcessed = 0, errorMessage = null) => {
  const query = `
    UPDATE import_jobs 
    SET status = $1, records_processed = $2, error_message = $3, updated_at = NOW()
    WHERE id = $4
    RETURNING *
  `;

  const result = await db.query(query, [status, recordsProcessed, errorMessage, jobId]);
  return result.rows[0];
};

const processImportData = async (jobId, data, userId) => {
  let recordsProcessed = 0;

  try {
    let activities = [];

    // Extract activities from official AdaLove 1.0 export
    if (data.activities && Array.isArray(data.activities)) {
      activities = data.activities;
    } else if (Array.isArray(data)) {
      activities = data;
    } else {
      throw new Error('Nenhuma atividade encontrada para importar');
    }

    console.log(`Processing ${activities.length} activities for user ${userId}`);

    // Process user activities in chunks
    const chunkSize = 50;
    for (let i = 0; i < activities.length; i += chunkSize) {
      const chunk = activities.slice(i, i + chunkSize);

      for (const activity of chunk) {
        // Process individual user activity from official export
        await processOfficialActivity(activity, userId);
        recordsProcessed++;

        // Update progress every 5 records
        if (recordsProcessed % 5 === 0) {
          await updateImportJob(jobId, 'processing', recordsProcessed);
        }
      }
    }

    await updateImportJob(jobId, 'completed', recordsProcessed);
    return { success: true, recordsProcessed };

  } catch (error) {
    await updateImportJob(jobId, 'error', recordsProcessed, error.message);
    throw error;
  }
};

// Process individual activity from official AdaLove 1.0 export
const processOfficialActivity = async (activity, userId) => {
  // Sanitize all string fields
  const sanitizedActivity = {};
  for (const [key, value] of Object.entries(activity)) {
    sanitizedActivity[key] = typeof value === 'string' ? sanitizeInput(value) : value;
  }

  // Generate unique IDs for the activity
  const studentActivityUuid = sanitizedActivity.studentActivityUuid || uuidv4();
  const activityId = sanitizedActivity.activityUuid || uuidv4();
  const studentActivityId = uuidv4();

  // Insert into student_activities table using correct column names
  const query = `
    INSERT INTO student_activities (id, studentactivityuuid, userid, activityid, statustypeid, activitynotes, activityrating, weightvalue, studyquestion, studyanswer)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    ON CONFLICT (studentactivityuuid) DO UPDATE SET
      activitynotes = EXCLUDED.activitynotes,
      activityrating = EXCLUDED.activityrating,
      weightvalue = EXCLUDED.weightvalue,
      studyquestion = EXCLUDED.studyquestion,
      studyanswer = EXCLUDED.studyanswer,
      updatedat = CURRENT_TIMESTAMP
  `;

  // Map official AdaLove 1.0 fields to AdaLove 2.0 schema
  await db.query(query, [
    studentActivityId, // id (unique for each student activity record)
    studentActivityUuid, // studentactivityuuid (from official export)
    userId, // userid (current logged user)
    activityId, // activityid (from official export)
    parseInt(sanitizedActivity.status) || 1, // statustypeid (status from export)
    sanitizedActivity.activityNotes || `Importado: ${sanitizedActivity.caption || 'Atividade'}`, // activitynotes
    parseInt(sanitizedActivity.activityRating) || 0, // activityrating
    parseFloat(sanitizedActivity.gradeWeight || sanitizedActivity.checkWeight || sanitizedActivity.conceptWeight) || 1.0, // weightvalue
    sanitizedActivity.studyQuestion || '', // studyquestion
    sanitizedActivity.studyAnswer || '' // studyanswer
  ]);

  console.log(`Processed activity: ${sanitizedActivity.caption} for user ${userId}`);
};



// API endpoint handlers
const importData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const file = req.file;

    // Parse JSON content
    let jsonData;
    try {
      jsonData = JSON.parse(file.buffer.toString('utf8'));
    } catch (error) {
      return res.status(400).json({ message: 'Invalid JSON format' });
    }

    // Validate structure
    const validation = validateAdaLove1Structure(jsonData);
    if (!validation.isValid) {
      return res.status(400).json({
        message: 'Invalid AdaLove 1.0 data structure',
        errors: validation.errors
      });
    }

    // Create import job
    const job = await createImportJob(
      userId,
      file.originalname,
      file.size,
      validation.estimatedRecords
    );

    // Start background processing
    setImmediate(async () => {
      try {
        await processImportData(job.id, jsonData, userId);
      } catch (error) {
        console.error('Import processing error:', error);
      }
    });

    res.status(200).json({
      message: 'Import started successfully',
      jobId: job.id,
      estimatedRecords: validation.estimatedRecords
    });

  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getImportStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const query = `
      SELECT * FROM import_jobs
      WHERE id = $1 AND user_id = $2
    `;

    const result = await db.query(query, [jobId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Import job not found' });
    }

    const job = result.rows[0];
    res.status(200).json({
      status: job.status,
      recordsProcessed: job.records_processed || 0,
      estimatedRecords: job.estimated_records,
      error: job.error_message,
      createdAt: job.created_at,
      updatedAt: job.updated_at
    });

  } catch (error) {
    console.error('Get import status error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getStatistics = async (req, res) => {
  try {
    const userId = req.user.id;

    const queries = await Promise.all([
      db.query('SELECT COUNT(*) as count FROM student_activities WHERE userid = $1', [userId]),
      db.query(`
        SELECT COUNT(DISTINCT filename) as count
        FROM import_jobs
        WHERE user_id = $1 AND status = 'completed'
      `, [userId]),
      db.query(`
        SELECT MAX(created_at) as last_import
        FROM import_jobs
        WHERE user_id = $1 AND status = 'completed'
      `, [userId])
    ]);

    res.status(200).json({
      totalActivities: parseInt(queries[0].rows[0].count),
      totalImports: parseInt(queries[1].rows[0].count),
      totalSections: 0, // Not applicable for user imports
      lastImportDate: queries[2].rows[0].last_import
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getImportHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT id, filename, file_size, estimated_records, records_processed,
             status, error_message, created_at, updated_at
      FROM import_jobs
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const result = await db.query(query, [userId]);
    res.status(200).json(result.rows);

  } catch (error) {
    console.error('Get import history error:', error);
    res.status(500).json({ message: error.message });
  }
};

const cancelImport = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const job = await updateImportJob(jobId, 'cancelled');

    if (!job) {
      return res.status(404).json({ message: 'Import job not found' });
    }

    res.status(200).json({ message: 'Import cancelled successfully' });

  } catch (error) {
    console.error('Cancel import error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  upload,
  sanitizeInput,
  validateAdaLove1Structure,
  createImportJob,
  updateImportJob,
  processImportData,
  processOfficialActivity,
  importData,
  getImportStatus,
  getStatistics,
  getImportHistory,
  cancelImport
};
