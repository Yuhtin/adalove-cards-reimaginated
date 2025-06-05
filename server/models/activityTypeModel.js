const db = require('../config/db');

class ActivityType {
  static async getAll() {
    const result = await db.query('SELECT id, name, iconUrl FROM activity_types ORDER BY id ASC');
    return result.rows;
  }
}

module.exports = ActivityType; 