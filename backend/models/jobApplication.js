const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/db");
const User = require("./User");
const Company=require("../models/Company")
const JobApplication = sequelize.define("JobApplication", {
  companyId:{
    type:DataTypes.INTEGER,
    
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  applicationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("Applied", "Interviewed", "Offered", "Rejected"),
    defaultValue: "Applied",
    
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  attachment: {
    type: DataTypes.STRING, 
    allowNull: true
  }
  ,
  applicationId:{
    type:DataTypes.INTEGER
  }
});


User.hasMany(JobApplication, { foreignKey: "userId" });
JobApplication.belongsTo(User, { foreignKey: "userId" });


Company.hasMany(JobApplication,{foreignKey:"companyId"})
JobApplication.belongsTo(Company,{foreignKey:"companyId"})

module.exports = JobApplication;
