const express = require("express");
const { connectDB, sequelize } = require("./config/db");
const cors = require("cors");
const path = require("path");

// Routes
const authRoutes = require("./routes/authRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const companyRoutes = require("./routes/companyRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "frontend")))



// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/job-applications", jobApplicationRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/companies", companyRoutes);


app.get("/", (req, res) => {

res.sendFile(path.join(__dirname, "signup.html"));

});

app.get("/login.html", (req, res) => {

res.sendFile(path.join(__dirname, "views", "login.html"));

});

app.get("/dashboard.html", (req, res) => {

res.sendFile(path.join(__dirname, "views", "expense.html"));

});



// Test DB connection
connectDB();



sequelize.sync() 
  .then(() => {
    console.log("✅ Models synced with database.");
    require("./cron/reminderCron");
  })
  .catch((err) => console.error("❌ Error syncing models:", err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
