import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const Admin = db.define(
  "admin",
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refresh_token: DataTypes.TEXT,
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Admin;
