-- Migration to update activity type names
-- This script updates the existing activity types to match the new naming convention

-- Update existing activity types
UPDATE activity_types SET name = 'Orientação' WHERE name = 'Apresentação';
UPDATE activity_types SET name = 'Artefatos' WHERE name = 'Outros';

-- Remove unused activity types (if they exist)
DELETE FROM activity_types WHERE name IN ('Avaliação e Pesquisa', 'Desenvolvimento de Projetos');

-- Insert new activity types if they don't exist
INSERT INTO activity_types (name, iconUrl) VALUES
('Orientação', '/images/icons/presentation.png'),
('Instrução', '/images/icons/instruction.png'),
('Autoestudo', '/images/icons/self-study.png'),
('Artefatos', '/images/icons/other.png')
ON CONFLICT (name) DO NOTHING;
