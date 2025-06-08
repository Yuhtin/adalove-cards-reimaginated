const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

// Helper function to create folder to week mapping from folders data
const createFolderToWeekMapping = (foldersData) => {
  const mapping = {};

  if (!foldersData || !Array.isArray(foldersData)) {
    return mapping;
  }

  // Find folders with "Semana XX" pattern
  foldersData.forEach(folder => {
    if (folder.caption && folder.caption.match(/^Semana \d+$/)) {
      // Extract week number from "Semana XX" format
      const weekMatch = folder.caption.match(/^Semana (\d+)$/);
      if (weekMatch) {
        const weekNumber = parseInt(weekMatch[1], 10);
        mapping[folder.id] = weekNumber;
      }
    }
  });

  return mapping;
};

// Helper function to filter activities to only include autoestudos from weekly folders
const filterAutoestudoActivities = (activities, folderToWeekMap) => {
  if (!activities || !Array.isArray(activities)) {
    return [];
  }

  return activities.filter(activity => {
    // Check if activity belongs to a "Semana XX" folder
    const isFromWeeklyFolder = folderToWeekMap.hasOwnProperty(activity.folder);
    return isFromWeeklyFolder;
  });
};

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_, file, cb) => {
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
    let sectionData = null;
    let foldersData = null;

    // Extract activities, section, and folders from official AdaLove 1.0 export
    if (data.activities && Array.isArray(data.activities)) {
      activities = data.activities;
      sectionData = data.section;
      foldersData = data.folders;
    } else if (Array.isArray(data)) {
      activities = data;
    } else {
      throw new Error('Nenhuma atividade encontrada para importar');
    }

    console.log(`Processing ${activities.length} activities for user ${userId}`);

    // Create folder to week mapping
    const folderToWeekMap = createFolderToWeekMapping(foldersData);
    console.log('Folder to week mapping:', folderToWeekMap);

    // Filter activities to only include autoestudos from "Semana XX" folders
    const filteredActivities = filterAutoestudoActivities(activities, folderToWeekMap);
    console.log(`Filtered to ${filteredActivities.length} autoestudo activities from weekly folders`);

    // First, process section data if available
    let sectionId = null;
    if (sectionData) {
      sectionId = await processOfficialSection(sectionData);
    }

    // Process user activities in chunks
    const chunkSize = 50;
    for (let i = 0; i < filteredActivities.length; i += chunkSize) {
      const chunk = filteredActivities.slice(i, i + chunkSize);

      for (const activity of chunk) {
        // Get week number from folder mapping
        const weekNumber = folderToWeekMap[activity.folder] || 1;

        // Process individual user activity from official export
        await processOfficialActivity(activity, userId, sectionId, weekNumber);
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

// Process section data from official AdaLove 1.0 export
const processOfficialSection = async (sectionData) => {
  // Sanitize all string fields
  const sanitizedSection = {};
  for (const [key, value] of Object.entries(sectionData)) {
    sanitizedSection[key] = typeof value === 'string' ? sanitizeInput(value) : value;
  }

  const sectionId = uuidv4();
  const sectionUuid = sanitizedSection.sectionUuid || uuidv4();

  // Insert or update section
  const sectionQuery = `
    INSERT INTO sections (
      id, sectionUuid, sectionCaption, sectionRepository, sectionDate, sectionType,
      advisorUuid, advisorName, advisorGender, projectUuid, projectCaption, projectDescription,
      sectionStatus, sectionActive, sectionHoursOne, sectionHoursTwo, sectionHoursThree,
      sectionToleranceOne, sectionToleranceTwo, sectionToleranceThree,
      sectionAttendanceTimeOne, sectionAttendanceTimeTwo, sectionAttendanceTimeThree,
      sectionIsRecovery, sectionLastUpdate, sectionLastSync, checkRestrictions,
      sectionHideAttendance, sectionAttendanceForAll, assistantAdvisorUuid, assistantAdvisorName
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)
    ON CONFLICT (sectionUuid) DO UPDATE SET
      sectionCaption = EXCLUDED.sectionCaption,
      sectionRepository = EXCLUDED.sectionRepository,
      sectionDate = EXCLUDED.sectionDate,
      sectionType = EXCLUDED.sectionType,
      advisorName = EXCLUDED.advisorName,
      projectCaption = EXCLUDED.projectCaption,
      projectDescription = EXCLUDED.projectDescription,
      updatedAt = CURRENT_TIMESTAMP
    RETURNING id
  `;

  const result = await db.query(sectionQuery, [
    sectionId,
    sectionUuid,
    sanitizedSection.sectionCaption || 'Seção Importada',
    sanitizedSection.sectionRepository || '',
    sanitizedSection.sectionDate ? new Date(sanitizedSection.sectionDate) : new Date(),
    sanitizedSection.sectionType || 'Graduação',
    sanitizedSection.advisorUuid || null,
    sanitizedSection.advisorName || '',
    sanitizedSection.advisorGender || '',
    sanitizedSection.projectUuid || null,
    sanitizedSection.projectCaption || '',
    sanitizedSection.projectDescription || '',
    sanitizedSection.sectionStatus || 'open',
    sanitizedSection.sectionActive || 1,
    sanitizedSection.sectionHoursOne || 0,
    sanitizedSection.sectionHoursTwo || 0,
    sanitizedSection.sectionHoursThree || 0,
    sanitizedSection.sectionToleranceOne || 0,
    sanitizedSection.sectionToleranceTwo || 0,
    sanitizedSection.sectionToleranceThree || 0,
    sanitizedSection.sectionAttendanceTimeOne || null,
    sanitizedSection.sectionAttendanceTimeTwo || null,
    sanitizedSection.sectionAttendanceTimeThree || null,
    sanitizedSection.sectionIsRecovery || 0,
    sanitizedSection.sectionLastUpdate ? new Date(sanitizedSection.sectionLastUpdate) : null,
    sanitizedSection.sectionLastSync ? new Date(sanitizedSection.sectionLastSync) : null,
    sanitizedSection.checkRestrictions || 0,
    sanitizedSection.sectionHideAttendance || 0,
    sanitizedSection.sectionAttendanceForAll || 0,
    sanitizedSection.assistantAdvisorUuid || null,
    sanitizedSection.assistantAdvisorName || ''
  ]);

  console.log(`Processed section: ${sanitizedSection.sectionCaption}`);
  return result.rows[0].id;
};

// Process individual activity from official AdaLove 1.0 export
const processOfficialActivity = async (activity, userId, sectionId = null, weekNumber = 1) => {
  // Sanitize all string fields
  const sanitizedActivity = {};
  for (const [key, value] of Object.entries(activity)) {
    sanitizedActivity[key] = typeof value === 'string' ? sanitizeInput(value) : value;
  }

  // Generate unique IDs
  const activityId = uuidv4();
  const activityUuid = sanitizedActivity.activityUuid || uuidv4();
  const studentActivityId = uuidv4();
  const studentActivityUuid = sanitizedActivity.studentActivityUuid || uuidv4();

  // Determine activity type based on the type field
  let activityTypeId = 2; // Default to "Instrução"
  if (sanitizedActivity.type) {
    switch (parseInt(sanitizedActivity.type)) {
      case 1: activityTypeId = 1; break; // Orientação 
      case 2: activityTypeId = 2; break; // Instrução
      case 11: activityTypeId = 3; break; // Autoestudo
      case 21: activityTypeId = 4; break; // Artefatos 
      default: activityTypeId = 2; break; // Default to "Instrução"
    }
  }

  // First, insert or update the activity
  const activityQuery = `
    INSERT INTO activities (
      id, activityUuid, sectionId, name, description, instructorName, instructorGender,
      assistantInstructorName, assistantInstructorUuid, activityTypeId, mandatory, date,
      basicActivityURL, weekNumber, sort, exam, makeup_exam, required
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    ON CONFLICT (activityUuid) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      instructorName = EXCLUDED.instructorName,
      date = EXCLUDED.date,
      updatedAt = CURRENT_TIMESTAMP
    RETURNING id
  `;

  const activityResult = await db.query(activityQuery, [
    activityId,
    activityUuid,
    sectionId,
    sanitizedActivity.caption || 'Atividade Importada',
    sanitizedActivity.description || '',
    sanitizedActivity.professorName || '',
    sanitizedActivity.professorGender || '',
    sanitizedActivity.assistantProfessorName || null,
    sanitizedActivity.assistantProfessorUuid || null,
    activityTypeId,
    sanitizedActivity.required === 1 || sanitizedActivity.mandatory === true,
    sanitizedActivity.date ? new Date(sanitizedActivity.date) : new Date(),
    sanitizedActivity.basicActivityURL || null,
    weekNumber, // weekNumber from folder mapping
    sanitizedActivity.sort || 0,
    sanitizedActivity.exam || 0,
    sanitizedActivity.makeup_exam || 0,
    sanitizedActivity.required || 1
  ]);

  const finalActivityId = activityResult.rows[0].id;

  // Then, insert or update the student activity
  const studentActivityQuery = `
    INSERT INTO student_activities (
      id, studentActivityUuid, userId, activityId, studentUuid, statusTypeId,
      activityNotes, activityRating, weightValue, studyQuestion, studyAnswer,
      attendance1, attendance2, attendance3, checkResult, conceptResult, gradeResult,
      folder, studentActivityId
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    ON CONFLICT (studentActivityUuid) DO UPDATE SET
      activityNotes = EXCLUDED.activityNotes,
      activityRating = EXCLUDED.activityRating,
      weightValue = EXCLUDED.weightValue,
      studyQuestion = EXCLUDED.studyQuestion,
      studyAnswer = EXCLUDED.studyAnswer,
      updatedAt = CURRENT_TIMESTAMP
  `;

  await db.query(studentActivityQuery, [
    studentActivityId,
    studentActivityUuid,
    userId,
    finalActivityId,
    sanitizedActivity.studentUuid || null,
    parseInt(sanitizedActivity.status) || 1,
    sanitizedActivity.activityNotes || `Importado: ${sanitizedActivity.caption || 'Atividade'}`,
    parseInt(sanitizedActivity.activityRating) || 0,
    parseFloat(sanitizedActivity.gradeWeight || sanitizedActivity.checkWeight || sanitizedActivity.conceptWeight) || 0,
    sanitizedActivity.studyQuestion || '',
    sanitizedActivity.studyAnswer || '',
    parseInt(sanitizedActivity.attendance1) || -1,
    parseInt(sanitizedActivity.attendance2) || -1,
    parseInt(sanitizedActivity.attendance3) || -1,
    parseInt(sanitizedActivity.checkResult) || -1,
    parseInt(sanitizedActivity.conceptResult) || -1,
    sanitizedActivity.gradeResult || '-1.0',
    sanitizedActivity.folder || null,
    parseInt(sanitizedActivity.studentActivityId) || null
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
  processOfficialSection,
  processOfficialActivity,
  importData,
  getImportStatus,
  getStatistics,
  getImportHistory,
  cancelImport
};
