const Section = require('../models/sectionModel');
const Activity = require('../models/activityModel');
const StudentActivity = require('../models/studentActivityModel');
const User = require('../models/userModel');

const getAllSections = async (req, res) => {
  try {
    const sections = await Section.getAll();
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSectionById = async (req, res) => {
  try {
    const section = await Section.getById(req.params.id);
    if (section) {
      res.status(200).json(section);
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSection = async (req, res) => {
  try {
    const newSection = await Section.create(req.body);
    res.status(201).json(newSection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSection = async (req, res) => {
  try {
    const updatedSection = await Section.update(req.params.id, req.body);
    
    if (updatedSection) {
      res.status(200).json(updatedSection);
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSection = async (req, res) => {
  try {
    const deleted = await Section.delete(req.params.id);
    
    if (deleted) {
      res.status(200).json({ message: 'Section deleted successfully' });
    } else {
      res.status(404).json({ error: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSectionActivities = async (req, res) => {
  try {
    const activities = await Section.getActivitiesBySection(req.params.id);
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const importFromAdaLove = async (req, res) => {
  try {
    const { section, activities } = req.body;
    const userId = req.user.id;

    if (!section || !activities || !Array.isArray(activities)) {
      return res.status(400).json({ error: 'Section and activities array are required' });
    }

    let sectionRecord = await Section.getByUuid(section.sectionUuid);
    if (!sectionRecord) {
      const sectionData = {
        sectionUuid: section.sectionUuid,
        sectionCaption: section.sectionCaption,
        sectionRepository: section.sectionRepository,
        sectionDate: new Date(section.sectionDate),
        sectionType: section.sectionType,
        advisorName: section.advisorName,
        projectCaption: section.projectCaption,
        projectDescription: section.projectDescription,
        sectionStatus: section.sectionStatus
      };
      sectionRecord = await Section.create(sectionData);
    }

    const importedActivities = [];
    const importedStudentActivities = [];

    for (const activityData of activities) {
      try {
        const activity = await Activity.importFromExternalSource(activityData, sectionRecord.id);
        if (activity) {
          importedActivities.push(activity);

          const studentActivity = await StudentActivity.importFromExternalSource(
            activityData, 
            userId, 
            activity.id
          );
          if (studentActivity) {
            importedStudentActivities.push(studentActivity);
          }
        }
      } catch (error) {
        console.error(`Error importing activity: ${activityData.caption}`, error);
      }
    }

    res.status(201).json({
      message: `Import completed successfully`,
      section: sectionRecord,
      importedActivitiesCount: importedActivities.length,
      importedStudentActivitiesCount: importedStudentActivities.length,
      activities: importedActivities,
      studentActivities: importedStudentActivities
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
  getSectionActivities,
  importFromAdaLove
}; 