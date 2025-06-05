const db = require('../config/db');

class Card {
  static async getAll() {
    const result = await db.query(`
      SELECT c.*,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl,
             st.name as statusName,
             st.iconUrl as statusIconUrl,
             u.username as ownerUsername
      FROM cards c
      JOIN activity_types at ON c.activityTypeId = at.id
      JOIN status_types st ON c.statusTypeId = st.id
      JOIN users u ON c.userId = u.id
      ORDER BY c.date ASC
    `);
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query(`
      SELECT c.*,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl,
             st.name as statusName,
             st.iconUrl as statusIconUrl,
             u.username as ownerUsername
      FROM cards c
      JOIN activity_types at ON c.activityTypeId = at.id
      JOIN status_types st ON c.statusTypeId = st.id
      JOIN users u ON c.userId = u.id
      WHERE c.id = $1
    `, [id]);
    return result.rows[0];
  }

  static async getByUserId(userId) {
    const result = await db.query(`
      SELECT c.*,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl,
             st.name as statusName,
             st.iconUrl as statusIconUrl
      FROM cards c
      JOIN activity_types at ON c.activityTypeId = at.id
      JOIN status_types st ON c.statusTypeId = st.id
      WHERE c.userId = $1
      ORDER BY c.date ASC
    `, [userId]);
    return result.rows;
  }

  /**
   * Import cards from an external source.
   * Essentially, this function will take data from the official adalove page and create a card in our system.
   * 
   * @param {*} externalData  
   * @param {*} userId 
   * @returns 
   */
  static async importFromExternalSource(externalData, userId) {
    let activityTypeId = await this._getOrCreateActivityType(externalData.type);
    
    if (!activityTypeId) {
      return null;
    }

    let statusTypeId = await this._mapExternalStatus(externalData.status);

    let date = externalData.date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const cardData = {
      userId: userId,
      name: externalData.caption,
      instructorName: externalData.professorName,
      activityTypeId: activityTypeId,
      description: externalData.description || 'This is a default description',
      mandatory: externalData.required === 1,
      relatedLinks: externalData.basicActivityURL,
      weekNumber: this._extractWeekFromData(externalData) || 1,
      weightValue: externalData.checkWeight || externalData.conceptWeight || externalData.gradeWeight || -1,
      statusTypeId: statusTypeId,
      date: date
    };

    return await this.create(cardData);
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
        activityName = 'Desenvolvimento de Projetos';
        iconUrl = '/images/icons/project.png';
        break;
      case 5:
        activityName = 'Encontro de Instrução';
        iconUrl = '/images/icons/practical-activity.png';
        break;
      default:
        return null;
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

  static async _mapExternalStatus(externalStatus) {
    let statusId;

    switch (externalStatus) {
      case 1:
        statusId = 1; // To Do
        break;
      case 2:
        statusId = 2; // In Progress
        break;
      case 3:
        statusId = 3; // Done
        break;
      default:
        statusId = 1; // Default to To Do
    }

    const statusResult = await db.query('SELECT id FROM status_types WHERE id = $1', [statusId]);

    if (statusResult.rows.length > 0) {
      return statusId;
    }

    return 1;
  }

  static _extractWeekFromData(externalData) {
    // TODO
    return 1; // Default week
  }

  static async create(data) {
    const result = await db.query(
      `INSERT INTO cards 
      (userId, name, instructorName, activityTypeId, description, mandatory, relatedLinks, weekNumber, weightValue, statusTypeId, date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [
        data.userId,
        data.name,
        data.instructorName,
        data.activityTypeId,
        data.description || 'This is a default description',
        data.mandatory || false,
        data.relatedLinks || null,
        data.weekNumber || 1,
        data.weightValue || -1,
        data.statusTypeId || 1,
        data.date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      ]
    );

    if (result.rows[0]) {
      return await this.getById(result.rows[0].id);
    }

    return null;
  }

  static async update(id, data) {
    const result = await db.query(
      `UPDATE cards 
      SET userId = $1, name = $2, instructorName = $3, activityTypeId = $4, 
          description = $5, mandatory = $6, relatedLinks = $7, 
          weekNumber = $8, weightValue = $9, statusTypeId = $10, date = $11
      WHERE id = $12 
      RETURNING *`,
      [
        data.userId,
        data.name,
        data.instructorName,
        data.activityTypeId,
        data.description,
        data.mandatory,
        data.relatedLinks,
        data.weekNumber,
        data.weightValue,
        data.statusTypeId,
        data.date,
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
      'UPDATE cards SET statusTypeId = $1 WHERE id = $2 RETURNING *',
      [statusTypeId, id]
    );

    if (result.rows[0]) {
      return await this.getById(id);
    }

    return null;
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM cards WHERE id = $1 RETURNING *', [id]);
    return result.rowCount > 0;
  }

  static async getCardsByFilters(filters) {
    let query = `
      SELECT c.*,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl,
             st.name as statusName,
             st.iconUrl as statusIconUrl,
             u.username as ownerUsername
      FROM cards c
      JOIN activity_types at ON c.activityTypeId = at.id
      JOIN status_types st ON c.statusTypeId = st.id
      JOIN users u ON c.userId = u.id`;

    let params = [];
    let conditionCount = 0;

    if (Object.keys(filters).length > 0) {
      query += ' WHERE';
    }

    if (filters.userId) {
      query += `${conditionCount > 0 ? ' AND' : ''} c.userId = $${++conditionCount}`;
      params.push(filters.userId);
    }

    if (filters.activityTypeId) {
      query += `${conditionCount > 0 ? ' AND' : ''} c.activityTypeId = $${++conditionCount}`;
      params.push(filters.activityTypeId);
    }

    if (filters.statusTypeId) {
      query += `${conditionCount > 0 ? ' AND' : ''} c.statusTypeId = $${++conditionCount}`;
      params.push(filters.statusTypeId);
    }

    if (filters.mandatory !== undefined) {
      query += `${conditionCount > 0 ? ' AND' : ''} c.mandatory = $${++conditionCount}`;
      params.push(filters.mandatory);
    }

    if (filters.weekNumber) {
      query += `${conditionCount > 0 ? ' AND' : ''} c.weekNumber = $${++conditionCount}`;
      params.push(filters.weekNumber);
    }

    if (filters.instructorName) {
      query += `${conditionCount > 0 ? ' AND' : ''} c.instructorName ILIKE $${++conditionCount}`;
      params.push(`%${filters.instructorName}%`);
    }

    if (filters.dateFrom) {
      query += `${conditionCount > 0 ? ' AND' : ''} c.date >= $${++conditionCount}`;
      params.push(filters.dateFrom);
    }

    if (filters.dateTo) {
      query += `${conditionCount > 0 ? ' AND' : ''} c.date <= $${++conditionCount}`;
      params.push(filters.dateTo);
    }

    if (filters.searchTerm) {
      query += `${conditionCount > 0 ? ' AND' : ''} (c.name ILIKE $${++conditionCount} OR c.description ILIKE $${++conditionCount})`;
      params.push(`%${filters.searchTerm}%`);
      params.push(`%${filters.searchTerm}%`);
    }

    if (filters.orderBy && filters.orderDirection) {
      const validColumns = ['name', 'date', 'weekNumber', 'weightValue'];
      const validDirections = ['ASC', 'DESC'];

      if (validColumns.includes(filters.orderBy) && validDirections.includes(filters.orderDirection.toUpperCase())) {
        query += ` ORDER BY c.${filters.orderBy} ${filters.orderDirection}`;
      } else {
        query += ' ORDER BY c.date ASC';
      }
    } else {
      query += ' ORDER BY c.date ASC';
    }

    if (filters.limit && filters.offset !== undefined) {
      query += ` LIMIT $${++conditionCount} OFFSET $${++conditionCount}`;
      params.push(filters.limit);
      params.push(filters.offset);
    }

    const result = await db.query(query, params);
    return result.rows;
  }

  static async getCardStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as totalCards,
        SUM(CASE WHEN statusTypeId = 1 THEN 1 ELSE 0 END) as todoCount,
        SUM(CASE WHEN statusTypeId = 2 THEN 1 ELSE 0 END) as doingCount,
        SUM(CASE WHEN statusTypeId = 3 THEN 1 ELSE 0 END) as doneCount,
        SUM(CASE WHEN mandatory = true THEN 1 ELSE 0 END) as mandatoryCount,
        COUNT(DISTINCT weekNumber) as totalWeeks
      FROM cards
      WHERE userId = $1
    `;

    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async bulkImportFromExternalSource(externalDataArray, userId) {
    const importedCards = [];

    for (const externalData of externalDataArray) {
      try {
        const card = await this.importFromExternalSource(externalData, userId);
        if (card) {
          importedCards.push(card);
        }
      } catch (error) {
        console.error(`Error importing card: ${externalData.caption}`, error);
      }
    }

    return importedCards;
  }
}

module.exports = Card;