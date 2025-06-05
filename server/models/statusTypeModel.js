const db = require('../config/db');

class StatusType {
  static async getAll() {
    const result = await db.query('SELECT id, name, iconUrl FROM status_types ORDER BY id ASC');
    return result.rows;
  }
}

module.exports = StatusType; 