-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    iconUrl VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sectionUuid VARCHAR(36) UNIQUE NOT NULL,
    sectionCaption VARCHAR(255) NOT NULL,
    sectionRepository TEXT,
    sectionDate DATE NOT NULL,
    sectionType VARCHAR(100),
    advisorUuid VARCHAR(36),
    advisorName VARCHAR(255),
    advisorGender VARCHAR(20),
    projectUuid VARCHAR(36),
    projectCaption VARCHAR(255),
    projectDescription TEXT,
    sectionStatus VARCHAR(50) DEFAULT 'open',
    sectionActive INTEGER DEFAULT 1,
    sectionHoursOne INTEGER DEFAULT 0,
    sectionHoursTwo INTEGER DEFAULT 0,
    sectionHoursThree INTEGER DEFAULT 0,
    sectionToleranceOne INTEGER DEFAULT 0,
    sectionToleranceTwo INTEGER DEFAULT 0,
    sectionToleranceThree INTEGER DEFAULT 0,
    sectionAttendanceTimeOne TIME,
    sectionAttendanceTimeTwo TIME,
    sectionAttendanceTimeThree TIME,
    sectionIsRecovery INTEGER DEFAULT 0,
    sectionLastUpdate TIMESTAMP,
    sectionLastSync TIMESTAMP,
    checkRestrictions INTEGER DEFAULT 0,
    sectionHideAttendance INTEGER DEFAULT 0,
    sectionAttendanceForAll INTEGER DEFAULT 0,
    assistantAdvisorUuid VARCHAR(36),
    assistantAdvisorName VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activityUuid VARCHAR(36) UNIQUE NOT NULL,
    sectionId UUID REFERENCES sections(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    instructorName VARCHAR(255),
    instructorGender VARCHAR(20),
    assistantInstructorName VARCHAR(255),
    assistantInstructorUuid VARCHAR(36),
    activityTypeId INTEGER REFERENCES activity_types(id),
    mandatory BOOLEAN DEFAULT false,
    date TIMESTAMP NOT NULL,
    basicActivityURL TEXT,
    weekNumber INTEGER DEFAULT 1,
    sort INTEGER DEFAULT 0,
    exam INTEGER DEFAULT 0,
    makeup_exam INTEGER DEFAULT 0,
    required INTEGER DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    studentActivityUuid VARCHAR(36) UNIQUE NOT NULL,
    userId UUID REFERENCES users(id) ON DELETE CASCADE,
    activityId UUID REFERENCES activities(id) ON DELETE CASCADE,
    studentUuid VARCHAR(36),
    statusTypeId INTEGER REFERENCES status_types(id) DEFAULT 1,
    activityNotes TEXT DEFAULT '',
    activityPositivePoints TEXT DEFAULT '',
    activityNegativePoints TEXT DEFAULT '',
    activityRating INTEGER DEFAULT 0,
    activityTags TEXT DEFAULT '',
    activityFeedback TEXT DEFAULT '',
    activityFeedbackGroup TEXT DEFAULT '',
    weightValue DECIMAL(5,2) DEFAULT 0,
    checkWeight DECIMAL(5,2) DEFAULT 0,
    conceptWeight DECIMAL(5,2) DEFAULT 0,
    gradeWeight DECIMAL(5,2) DEFAULT 0,
    studyQuestion TEXT DEFAULT '',
    studyAnswer TEXT DEFAULT '',
    evaluated INTEGER DEFAULT 0,
    blocked INTEGER DEFAULT 0,
    attendance1 INTEGER DEFAULT -1,
    attendance2 INTEGER DEFAULT -1,
    attendance3 INTEGER DEFAULT -1,
    checkResult INTEGER DEFAULT -1,
    conceptResult INTEGER DEFAULT -1,
    gradeResult VARCHAR(10) DEFAULT '-1.0',
    folder VARCHAR(36),
    studentActivityId INTEGER,
    absenceAllowanceType VARCHAR(50),
    absenceAllowanceTypeName VARCHAR(100),
    absencePeriod VARCHAR(50),
    absenceAllowanceReason TEXT,
    ticketNumber VARCHAR(50),
    absenceAllowanceUuid VARCHAR(36),
    exSectionActivityExamUuid VARCHAR(36),
    examStatus VARCHAR(50),
    exStudentExamUuid VARCHAR(36),
    exStudentExamStatus VARCHAR(50),
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
CREATE INDEX IF NOT EXISTS idx_student_activities_student_uuid ON student_activities(studentUuid);

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