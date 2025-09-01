const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Company = require("./Company");

const JobListing = sequelize.define("JobListing", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, { timestamps: true });


Company.hasMany(JobListing, { foreignKey: "companyId" });
JobListing.belongsTo(Company, { foreignKey: "companyId" });

module.exports = JobListing;
