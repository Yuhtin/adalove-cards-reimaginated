const db = require('../config/db');

class Section {
  static async getAll() {
    const result = await db.query('SELECT * FROM sections ORDER BY sectionDate DESC');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM sections WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getByUuid(sectionUuid) {
    const result = await db.query('SELECT * FROM sections WHERE sectionUuid = $1', [sectionUuid]);
    return result.rows[0];
  }

  static async create(data) {
    const result = await db.query(
      `INSERT INTO sections 
      (sectionUuid, sectionCaption, sectionRepository, sectionDate, sectionType, 
       advisorName, projectCaption, projectDescription, sectionStatus) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [
        data.sectionUuid,
        data.sectionCaption,
        data.sectionRepository,
        data.sectionDate,
        data.sectionType,
        data.advisorName,
        data.projectCaption,
        data.projectDescription,
        data.sectionStatus || 'open'
      ]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      `UPDATE sections 
      SET sectionCaption = $1, sectionRepository = $2, sectionDate = $3, 
          sectionType = $4, advisorName = $5, projectCaption = $6, 
          projectDescription = $7, sectionStatus = $8
      WHERE id = $9 
      RETURNING *`,
      [
        data.sectionCaption,
        data.sectionRepository,
        data.sectionDate,
        data.sectionType,
        data.advisorName,
        data.projectCaption,
        data.projectDescription,
        data.sectionStatus,
        id
      ]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM sections WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }

  static async getActivitiesBySection(sectionId) {
    const result = await db.query(`
      SELECT a.*,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl
      FROM activities a
      JOIN activity_types at ON a.activityTypeId = at.id
      WHERE a.sectionId = $1
      ORDER BY a.date ASC
    `, [sectionId]);
    return result.rows;
  }
}

module.exports = Section; 