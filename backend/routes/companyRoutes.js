const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");
const {protect}=require("../middleware/authMiddleware")


router.post("/",protect, companyController.createCompany);
router.get("/", protect,companyController.getAllCompanies);


router.post("/job-listings",protect, companyController.createJobListing);
router.get("/job-listings",protect, companyController.getAllJobListings);

module.exports = router;

