const fs = require('fs');
const path = require('path');
const db = require('../config/db');

async function runMigration() {
  try {
    console.log('Running import_jobs table migration...');
    
    const migrationPath = path.join(__dirname, '../migrations/create_import_jobs_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    await db.query(migrationSQL);
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
