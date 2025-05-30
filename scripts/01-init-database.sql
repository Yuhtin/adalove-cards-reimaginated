CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;
DROP TABLE IF EXISTS instruction_areas CASCADE;
DROP TABLE IF EXISTS activity_types CASCADE;
DROP TABLE IF EXISTS status_types CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(16) NOT NULL,
  password TEXT NOT NULL,
  iconUrl TEXT NULL
);

CREATE TABLE activity_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(30) NOT NULL UNIQUE,
  iconUrl TEXT NOT NULL
);

CREATE TABLE status_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL UNIQUE,
  iconUrl TEXT NOT NULL
);

CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES users(id),
  name VARCHAR(100) NOT NULL UNIQUE,
  instructorName VARCHAR(100) NOT NULL,
  activityTypeId UUID NOT NULL REFERENCES activity_types(id),
  description TEXT NULL DEFAULT 'This is a default description',
  mandatory BOOLEAN DEFAULT false,
  relatedLinks TEXT NULL,
  weekNumber INT DEFAULT 1,
  weightValue INT DEFAULT -1,
  statusTypeId INT NOT NULL DEFAULT 1 REFERENCES status_types(id),
  date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 week')
);