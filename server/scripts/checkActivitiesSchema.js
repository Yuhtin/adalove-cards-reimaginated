const db = require('../config/db');

async function checkSchema() {
  try {
    console.log('Checking student_activities table structure...');
    
    const result = await db.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'student_activities' 
      ORDER BY ordinal_position;
    `);
    
    console.log('Student_activities table columns:');
    console.table(result.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking schema:', error);
    process.exit(1);
  }
}

checkSchema();
