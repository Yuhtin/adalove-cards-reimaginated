const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

const runSQLScript = async () => {
  const migrationsPath = path.join(__dirname, '../migrations');
  const migrationFiles = fs.readdirSync(migrationsPath);
  for (const file of migrationFiles) {
    const filePath = path.join(migrationsPath, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    try {
      await pool.query(sql);
      console.log(`Script SQL ${file} executado com sucesso!`);
    } catch (err) {
      console.error(`Erro ao executar o script SQL ${file}:`, err);
    }
  }
};

runSQLScript();
