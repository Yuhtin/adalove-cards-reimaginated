const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static async getAll() {
    const result = await db.query('SELECT id, email, username, iconUrl FROM users');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT id, username, email, iconUrl FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getByUsername(username) {
    const result = await db.query('SELECT id, email, username, iconUrl FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    return result.rows[0];
  }

  static async getByEmail(email) {
    const result = await db.query('SELECT id, username, email, iconUrl FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    return result.rows[0];
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await db.query(
      'INSERT INTO users (username, email, password, iconUrl) VALUES ($1, $2, $3, $4) RETURNING id, email, username, iconUrl',
      [data.username, data.email, hashedPassword, data.iconUrl || null]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    let updateFields = [];
    let params = [];
    let paramCounter = 1;

    if (data.username !== undefined) {
      updateFields.push(`username = $${paramCounter++}`);
      params.push(data.username);
    }
    
    if (data.password !== undefined) {
      updateFields.push(`password = $${paramCounter++}`);
      params.push(await bcrypt.hash(data.password, 10)); 
    }
    
    if (data.iconUrl !== undefined) {
      updateFields.push(`iconUrl = $${paramCounter++}`);
      params.push(data.iconUrl);
    }
    
    if (updateFields.length === 0) {
      return null;
    }
    
    params.push(id);
    
    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCounter} 
      RETURNING id, username, email, iconUrl
    `;
    
    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rowCount > 0;
  }

  static async authenticate(email, password) {
    const result = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (result.rows.length === 0) return null;
    
    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) return null;
    
    delete user.password;
    return user;
  }

  static async getUserWithCards(id) {
    const userResult = await db.query('SELECT id, username, email, iconUrl FROM users WHERE id = $1', [id]);
    
    if (userResult.rows.length === 0) {
      return null;
    }
    
    const user = userResult.rows[0];
    
    const cardsResult = await db.query(`
      SELECT c.*, 
             c.instructorName,
             at.name as activityTypeName,
             at.iconUrl as activityTypeIconUrl,
             st.name as statusName,
             st.iconUrl as statusIconUrl
      FROM cards c
      JOIN activity_types at ON c.activityTypeId = at.id
      JOIN status_types st ON c.statusTypeId = st.id
      WHERE c.userId = $1
      ORDER BY c.date ASC
    `, [id]);
    
    user.cards = cardsResult.rows;
    return user;
  }
  
  static async changePassword(id, oldPassword, newPassword) {
    const userResult = await db.query('SELECT password FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) return false;
    
    const isValidOldPassword = await bcrypt.compare(oldPassword, userResult.rows[0].password);
    if (!isValidOldPassword) return false;
    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const updateResult = await db.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
      [hashedNewPassword, id]
    );
    
    return updateResult.rowCount > 0;
  }
  
  static async updateIcon(id, iconUrl) {
    const result = await db.query(
      'UPDATE users SET iconUrl = $1 WHERE id = $2 RETURNING id, username, email, iconUrl',
      [iconUrl, id]
    );
    return result.rows[0];
  }
}

module.exports = User;