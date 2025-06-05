const db = require('../config/db');

class StudentActivity {
  static async getAll() {
    const result = await db.query(`
      SELECT sa.*,
             a.name as activityName,
             a.description as activityDescription,
             a.instructorName,
             a.mandatory,
             a.date as activityDate,
             a.weekNumber,
             u.username,
             st.name as statusName,
             st.iconUrl as statusIconUrl,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl,
             s.sectionCaption
      FROM student_activities sa
      JOIN activities a ON sa.activityId = a.id
      JOIN users u ON sa.userId = u.id
      JOIN status_types st ON sa.statusTypeId = st.id
      JOIN activity_types at ON a.activityTypeId = at.id
      LEFT JOIN sections s ON a.sectionId = s.id
      ORDER BY a.date ASC
    `);
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query(`
      SELECT sa.*,
             a.name as activityName,
             a.description as activityDescription,
             a.instructorName,
             a.mandatory,
             a.date as activityDate,
             a.weekNumber,
             u.username,
             st.name as statusName,
             st.iconUrl as statusIconUrl,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl,
             s.sectionCaption
      FROM student_activities sa
      JOIN activities a ON sa.activityId = a.id
      JOIN users u ON sa.userId = u.id
      JOIN status_types st ON sa.statusTypeId = st.id
      JOIN activity_types at ON a.activityTypeId = at.id
      LEFT JOIN sections s ON a.sectionId = s.id
      WHERE sa.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async getByUserId(userId) {
    const result = await db.query(`
      SELECT sa.*,
             a.name as activityName,
             a.description as activityDescription,
             a.instructorName,
             a.mandatory,
             a.date as activityDate,
             a.weekNumber,
             a.basicActivityURL,
             st.name as statusName,
             st.iconUrl as statusIconUrl,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl,
             s.sectionCaption
      FROM student_activities sa
      JOIN activities a ON sa.activityId = a.id
      JOIN status_types st ON sa.statusTypeId = st.id
      JOIN activity_types at ON a.activityTypeId = at.id
      LEFT JOIN sections s ON a.sectionId = s.id
      WHERE sa.userId = $1
      ORDER BY a.date ASC
    `, [userId]);
    return result.rows;
  }

  static async getByUserAndActivity(userId, activityId) {
    const result = await db.query(`
      SELECT sa.*,
             a.name as activityName,
             a.description as activityDescription,
             a.instructorName,
             a.mandatory,
             a.date as activityDate,
             a.weekNumber,
             st.name as statusName,
             st.iconUrl as statusIconUrl,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl
      FROM student_activities sa
      JOIN activities a ON sa.activityId = a.id
      JOIN status_types st ON sa.statusTypeId = st.id
      JOIN activity_types at ON a.activityTypeId = at.id
      WHERE sa.userId = $1 AND sa.activityId = $2
    `, [userId, activityId]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      `INSERT INTO student_activities 
      (studentActivityUuid, userId, activityId, statusTypeId, activityNotes, 
       activityRating, weightValue, studyQuestion, studyAnswer) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [
        data.studentActivityUuid,
        data.userId,
        data.activityId,
        data.statusTypeId || 1, // Default to "To Do"
        data.activityNotes || '',
        data.activityRating || 0,
        data.weightValue || 0,
        data.studyQuestion || '',
        data.studyAnswer || ''
      ]
    );

    if (result.rows[0]) {
      return await this.getById(result.rows[0].id);
    }
    return null;
  }

  static async update(id, data) {
    const result = await db.query(
      `UPDATE student_activities 
      SET statusTypeId = $1, activityNotes = $2, activityRating = $3, 
          weightValue = $4, studyQuestion = $5, studyAnswer = $6
      WHERE id = $7 
      RETURNING *`,
      [
        data.statusTypeId,
        data.activityNotes,
        data.activityRating,
        data.weightValue,
        data.studyQuestion,
        data.studyAnswer,
        id
      ]
    );

    if (result.rows[0]) {
      return await this.getById(id);
    }
    return null;
  }

  static async updateStatus(id, statusTypeId) {
    const result = await db.query(
      'UPDATE student_activities SET statusTypeId = $1 WHERE id = $2 RETURNING *',
      [statusTypeId, id]
    );

    if (result.rows[0]) {
      return await this.getById(id);
    }
    return null;
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM student_activities WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }

  static async importFromExternalSource(externalData, userId, activityId) {
    let statusTypeId = this._mapExternalStatus(externalData.status);

    const studentActivityData = {
      studentActivityUuid: externalData.studentActivityUuid,
      userId: userId,
      activityId: activityId,
      statusTypeId: statusTypeId,
      activityNotes: externalData.activityNotes || '',
      activityRating: externalData.activityRating || 0,
      weightValue: externalData.checkWeight || externalData.conceptWeight || externalData.gradeWeight || 0,
      studyQuestion: externalData.studyQuestion || '',
      studyAnswer: externalData.studyAnswer || ''
    };

    const existing = await this.getByUserAndActivity(userId, activityId);
    if (existing) {
      return await this.update(existing.id, studentActivityData);
    }

    return await this.create(studentActivityData);
  }

  static _mapExternalStatus(externalStatus) {
    switch (externalStatus) {
      case 1:
        return 1; // To Do
      case 2:
        return 2; // In Progress
      case 3:
        return 3; // Done
      default:
        return 1; // Default to To Do
    }
  }

  static async getStudentActivityStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as totalActivities,
        SUM(CASE WHEN sa.statusTypeId = 1 THEN 1 ELSE 0 END) as todoCount,
        SUM(CASE WHEN sa.statusTypeId = 2 THEN 1 ELSE 0 END) as doingCount,
        SUM(CASE WHEN sa.statusTypeId = 3 THEN 1 ELSE 0 END) as doneCount,
        SUM(CASE WHEN a.mandatory = true THEN 1 ELSE 0 END) as mandatoryCount,
        COUNT(DISTINCT a.weekNumber) as totalWeeks
      FROM student_activities sa
      JOIN activities a ON sa.activityId = a.id
      WHERE sa.userId = $1
    `;

    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async getActivitiesByFilters(filters) {
    let query = `
      SELECT sa.*,
             a.name as activityName,
             a.description as activityDescription,
             a.instructorName,
             a.mandatory,
             a.date as activityDate,
             a.weekNumber,
             a.basicActivityURL,
             st.name as statusName,
             st.iconUrl as statusIconUrl,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl,
             s.sectionCaption
      FROM student_activities sa
      JOIN activities a ON sa.activityId = a.id
      JOIN status_types st ON sa.statusTypeId = st.id
      JOIN activity_types at ON a.activityTypeId = at.id
      LEFT JOIN sections s ON a.sectionId = s.id`;

    let params = [];
    let conditionCount = 0;

    if (Object.keys(filters).length > 0) {
      query += ' WHERE';
    }

    if (filters.userId) {
      query += `${conditionCount > 0 ? ' AND' : ''} sa.userId = $${++conditionCount}`;
      params.push(filters.userId);
    }

    if (filters.activityTypeId) {
      query += `${conditionCount > 0 ? ' AND' : ''} a.activityTypeId = $${++conditionCount}`;
      params.push(filters.activityTypeId);
    }

    if (filters.statusTypeId) {
      query += `${conditionCount > 0 ? ' AND' : ''} sa.statusTypeId = $${++conditionCount}`;
      params.push(filters.statusTypeId);
    }

    if (filters.mandatory !== undefined) {
      query += `${conditionCount > 0 ? ' AND' : ''} a.mandatory = $${++conditionCount}`;
      params.push(filters.mandatory);
    }

    if (filters.weekNumber) {
      query += `${conditionCount > 0 ? ' AND' : ''} a.weekNumber = $${++conditionCount}`;
      params.push(filters.weekNumber);
    }

    if (filters.instructorName) {
      query += `${conditionCount > 0 ? ' AND' : ''} a.instructorName ILIKE $${++conditionCount}`;
      params.push(`%${filters.instructorName}%`);
    }

    if (filters.searchTerm) {
      query += `${conditionCount > 0 ? ' AND' : ''} (a.name ILIKE $${++conditionCount} OR a.description ILIKE $${++conditionCount})`;
      params.push(`%${filters.searchTerm}%`);
      params.push(`%${filters.searchTerm}%`);
    }

    query += ' ORDER BY a.date ASC';

    if (filters.limit && filters.offset !== undefined) {
      query += ` LIMIT $${++conditionCount} OFFSET $${++conditionCount}`;
      params.push(filters.limit);
      params.push(filters.offset);
    }

    const result = await db.query(query, params);
    return result.rows;
  }
}

module.exports = StudentActivity; 