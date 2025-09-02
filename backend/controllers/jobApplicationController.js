const JobApplication = require("../models/jobApplication");
const Company  = require("../models/Company");
const { Op } = require("sequelize");


exports.createJobApplication = async (req, res) => {
  try {
    const { companyName, jobTitle, applicationDate, status, notes } = req.body;
    const userId = req.user.id; 

    const application = await JobApplication.create({
      companyName,
      jobTitle,
      applicationDate,
      status,
      notes,
      attachment: req.file ? req.file.path : null,
      userId
    });

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const applications = await JobApplication.findAll({ where: { userId } });
    console.log("aplications",applications)
    res.json({ success: true, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteJobApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const application = await JobApplication.findOne({ where: { id, userId } });
    if (!application) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    await application.destroy();
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.searchApplications = async (req, res) => {
  try {
    console.log(req.query)
    const { title, status, startDate, endDate } = req.query;
    const whereClause = { userId: req.user.id };

    if (title) whereClause.jobTitle = { [Op.like]: `%${title}%` };
    
    if (status) whereClause.status = status;
    if (startDate && endDate) {
      whereClause.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }

    const applications = await JobApplication.findAll({
      where: whereClause,
      include: [{ model: Company, attributes: ["name"] }]
    });
console.log("applications",applications)
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};