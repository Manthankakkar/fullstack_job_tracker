const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");
const {protect} = require("../middleware/authMiddleware");

router.post("/", protect, reminderController.createReminder);
router.get("/", protect, reminderController.getReminders);

module.exports = router;
