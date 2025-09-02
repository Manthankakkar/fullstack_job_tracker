const Reminder = require("../models/Reminder");
const JobApplication = require("../models/jobApplication");
const User = require("../models/User");
const emailClient = require("../config/email");


exports.createReminder = async (req, res) => {
  try {
    const { jobApplicationId, reminderDate, message } = req.body;
    const userId = req.user.id;
    console.log(req.body)

    const jobApp = await JobApplication.findByPk(jobApplicationId);
    if (!jobApp) return res.status(404).json({ message: "Job Application not found" });

    const reminder = await Reminder.create({ userId, jobApplicationId, reminderDate, message });
    res.status(201).json({ success: true, data: reminder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await Reminder.findAll({
      where: { userId },
      include: [{ model: JobApplication, attributes: ["companyName", "jobTitle"] }]
    });
    res.json({ success: true, data: reminders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
