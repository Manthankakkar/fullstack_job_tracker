const cron = require("node-cron");
const Reminder = require("../models/Reminder");
const User = require("../models/User");
const emailClient = require("../config/email");

cron.schedule("* * * * *", async () => {  
  const now = new Date();

  const reminders = await Reminder.findAll({
    where: {
      reminderDate: { [require("sequelize").Op.lte]: now },
      sent: false
    },
    include: [User]
  });

  for (let reminder of reminders) {
    try {
      await emailClient.sendTransacEmail({
  sender: { name: "Job Tracker", email: "manthankakkar05@gmail.com" },
  to: [{ email: reminder.User.email, name: reminder.User.name }],
  subject: "Job Follow-Up Reminder",
  htmlContent: `<p>${reminder.message || "You have a follow-up for your job application!"}</p>`
});

      ;
      reminder.sent = true;
      await reminder.save();
      console.log(`Reminder sent to ${reminder.User.email}`);
    } catch (err) {
      console.error("Error sending reminder email:", err.message);
    }
  }
});
