const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect} = require("../middleware/authMiddleware");

const { sequelize } = require("../config/db");  
const { Op, fn, col } = require("sequelize"); 
const {
  createJobApplication,
  getJobApplications,
  deleteJobApplication
  ,searchApplications
} = require("../controllers/jobApplicationController");

router.post("/", protect, upload.single("attachment"), createJobApplication);
router.get("/", protect, getJobApplications);
router.delete("/:id", protect, deleteJobApplication);

router.get("/search", protect, searchApplications)

const JobApplication = require("../models/JobApplication");




// Get status count
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const statusCounts = await JobApplication.findAll({
      where: { userId },
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("status")), "count"]
      ],
      group: ["status"]
    });

    res.json({ success: true, data: statusCounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Applications over time (monthly)
router.get("/timeline", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const timeline = await JobApplication.findAll({
      where: { userId },
      attributes: [
        [sequelize.fn("MONTH", sequelize.col("applicationDate")), "month"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"]
      ],
      group: ["month"],
      order: [[sequelize.fn("MONTH", sequelize.col("applicationDate")), "ASC"]]
    });

    res.json({ success: true, data: timeline });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;



