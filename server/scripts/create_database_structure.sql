DROP TABLE IF EXISTS activity_types CASCADE;
DROP TABLE IF EXISTS status_types CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS student_activities CASCADE;

CREATE TABLE IF NOT EXISTS activity_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    iconUrl VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS status_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    iconUrl VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    iconUrl VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    sectionUuid VARCHAR(255) UNIQUE NOT NULL,
    sectionCaption VARCHAR(255) NOT NULL,
    sectionRepository TEXT,
    sectionDate DATE NOT NULL,
    sectionType VARCHAR(100),
    advisorName VARCHAR(255),
    projectCaption VARCHAR(255),
    projectDescription TEXT,
    sectionStatus VARCHAR(50) DEFAULT 'open',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    activityUuid VARCHAR(255) UNIQUE NOT NULL,
    sectionId INTEGER REFERENCES sections(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructorName VARCHAR(255),
    activityTypeId INTEGER REFERENCES activity_types(id),
    mandatory BOOLEAN DEFAULT false,
    date TIMESTAMP NOT NULL,
    basicActivityURL TEXT,
    weekNumber INTEGER DEFAULT 1,
    sort INTEGER DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_activities (
    id SERIAL PRIMARY KEY,
    studentActivityUuid VARCHAR(255) UNIQUE NOT NULL,
    userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activityId INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    statusTypeId INTEGER REFERENCES status_types(id) DEFAULT 1,
    activityNotes TEXT DEFAULT '',
    activityRating INTEGER DEFAULT 0,
    weightValue DECIMAL(5,2) DEFAULT 0,
    studyQuestion TEXT DEFAULT '',
    studyAnswer TEXT DEFAULT '',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userId, activityId)
);

CREATE INDEX IF NOT EXISTS idx_sections_uuid ON sections(sectionUuid);
CREATE INDEX IF NOT EXISTS idx_activities_uuid ON activities(activityUuid);
CREATE INDEX IF NOT EXISTS idx_activities_section ON activities(sectionId);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_week ON activities(weekNumber);
CREATE INDEX IF NOT EXISTS idx_student_activities_user ON student_activities(userId);
CREATE INDEX IF NOT EXISTS idx_student_activities_activity ON student_activities(activityId);
CREATE INDEX IF NOT EXISTS idx_student_activities_status ON student_activities(statusTypeId);
CREATE INDEX IF NOT EXISTS idx_student_activities_uuid ON student_activities(studentActivityUuid);

INSERT INTO activity_types (name, iconUrl) VALUES
('Apresentação', '/images/icons/presentation.png'),
('Instrução', '/images/icons/instruction.png'),
('Autoestudo', '/images/icons/self-study.png'),
('Outros', '/images/icons/other.png')
ON CONFLICT (name) DO NOTHING;

INSERT INTO status_types (name, iconUrl) VALUES 
('A fazer', '/images/icons/todo.png'),
('Fazendo', '/images/icons/doing.png'),
('Feito', '/images/icons/done.png')
ON CONFLICT (name) DO NOTHING;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_activities_updated_at BEFORE UPDATE ON student_activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 