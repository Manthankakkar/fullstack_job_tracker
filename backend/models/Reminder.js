const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User");
const JobApplication = require("./JobApplication");

const Reminder = sequelize.define("Reminder", {
  reminderDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});


User.hasMany(Reminder, { foreignKey: "userId" });
Reminder.belongsTo(User, { foreignKey: "userId" });

JobApplication.hasMany(Reminder, { foreignKey: "jobApplicationId" });
Reminder.belongsTo(JobApplication, { foreignKey: "jobApplicationId" });

module.exports = Reminder;
