const db = require('../config/db');

class Activity {
  static async getAll() {
    const result = await db.query(`
      SELECT a.*,
             s.sectionCaption,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl
      FROM activities a
      LEFT JOIN sections s ON a.sectionId = s.id
      JOIN activity_types at ON a.activityTypeId = at.id
      ORDER BY a.date ASC
    `);
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query(`
      SELECT a.*,
             s.sectionCaption,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl
      FROM activities a
      LEFT JOIN sections s ON a.sectionId = s.id
      JOIN activity_types at ON a.activityTypeId = at.id
      WHERE a.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async getByUuid(activityUuid) {
    const result = await db.query(`
      SELECT a.*,
             s.sectionCaption,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl
      FROM activities a
      LEFT JOIN sections s ON a.sectionId = s.id
      JOIN activity_types at ON a.activityTypeId = at.id
      WHERE a.activityUuid = $1
    `, [activityUuid]);
    return result.rows[0];
  }

  static async getBySectionId(sectionId) {
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

  static async create(data) {
    const result = await db.query(
      `INSERT INTO activities 
      (activityUuid, sectionId, name, description, instructorName, activityTypeId, 
       mandatory, date, basicActivityURL, weekNumber, sort) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [
        data.activityUuid,
        data.sectionId,
        data.name,
        data.description,
        data.instructorName,
        data.activityTypeId,
        data.mandatory || false,
        data.date,
        data.basicActivityURL,
        data.weekNumber,
        data.sort || 0
      ]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const result = await db.query(
      `UPDATE activities 
      SET name = $1, description = $2, instructorName = $3, activityTypeId = $4, 
          mandatory = $5, date = $6, basicActivityURL = $7, weekNumber = $8, sort = $9
      WHERE id = $10 
      RETURNING *`,
      [
        data.name,
        data.description,
        data.instructorName,
        data.activityTypeId,
        data.mandatory,
        data.date,
        data.basicActivityURL,
        data.weekNumber,
        data.sort,
        id
      ]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM activities WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }

  static async importFromExternalSource(externalData, sectionId) {
    let activityTypeId = await this._getOrCreateActivityType(externalData.type);
    
    if (!activityTypeId) {
      return null;
    }

    const weekNumber = this._calculateWeekNumber(externalData.sort);

    const activityData = {
      activityUuid: externalData.activityUuid,
      sectionId: sectionId,
      name: externalData.caption,
      description: externalData.description,
      instructorName: externalData.professorName,
      activityTypeId: activityTypeId,
      mandatory: externalData.required === 1,
      date: new Date(externalData.date),
      basicActivityURL: externalData.basicActivityURL,
      weekNumber: weekNumber,
      sort: externalData.sort
    };

    const existingActivity = await this.getByUuid(externalData.activityUuid);
    if (existingActivity) {
      return existingActivity;
    }

    return await this.create(activityData);
  }

  static async _getOrCreateActivityType(externalType) {
    let activityName;
    let iconUrl;

    switch (externalType) {
      case 2:
        activityName = 'Autoestudo';
        iconUrl = '/images/icons/self-study.png';
        break;
      case 4:
        activityName = 'Artefatos';
        iconUrl = '/images/icons/project.png';
        break;
      case 5:
        activityName = 'Encontro de Instrução';
        iconUrl = '/images/icons/practical-activity.png';
        break;
      default:
        return null; // Ignored type
    }

    const typeResult = await db.query('SELECT id FROM activity_types WHERE name = $1', [activityName]);

    if (typeResult.rows.length > 0) {
      return typeResult.rows[0].id;
    }

    const newTypeResult = await db.query(
      'INSERT INTO activity_types (name, iconUrl) VALUES ($1, $2) RETURNING id',
      [activityName, iconUrl]
    );

    return newTypeResult.rows[0].id;
  }

  static _calculateWeekNumber(sort) {
    return Math.ceil(sort / 4) || 1;
  }
}

module.exports = Activity; 