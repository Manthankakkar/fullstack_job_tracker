const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");


router.post("/", companyController.createCompany);
router.get("/", companyController.getAllCompanies);


router.post("/job-listings", companyController.createJobListing);
router.get("/job-listings", companyController.getAllJobListings);

module.exports = router;

