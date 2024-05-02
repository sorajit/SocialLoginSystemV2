require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DB_STRING);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
Users = require('./model/Users')(sequelize,Sequelize);
db.Users = db.sequelize.models.Users;
module.exports = db;
