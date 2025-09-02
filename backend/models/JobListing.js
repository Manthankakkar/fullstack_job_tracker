const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Company = require("./Company");
const User = require("./User")

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
   userId: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "CASCADE",
  }
}, { timestamps: true });


Company.hasMany(JobListing, { foreignKey: "companyId" });
JobListing.belongsTo(Company, { foreignKey: "companyId" });


User.hasMany(JobListing, { foreignKey: "userId" });
JobListing.belongsTo(User, { foreignKey: "userId" })

module.exports = JobListing;
