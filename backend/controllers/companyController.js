const Company = require("../models/Company");
const JobListing = require("../models/JobListing");

exports.createCompany = async (req, res) => {
  try {
    const {name, website, industry, description} = req.body;
    console.log(req.body)
    
    const company = await Company.create({ name, website, industry, description });
    res.status(201).json({ success: true, data: company });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create company", error });
  }
};


exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({ order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch companies", error });
  }
};



// Create Job Listing under a company
exports.createJobListing = async (req, res) => {
  try {
    const { companyId, title, location, link } = req.body;
    const job = await JobListing.create({ companyId, title, location, link });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create job listing", error });
  }
};

// Get all job listings with company info
exports.getAllJobListings = async (req, res) => {
  try {
    const jobs = await JobListing.findAll({
      include: [{ model: Company }],
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch job listings", error });
  }
};
