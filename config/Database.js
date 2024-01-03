import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const db = new Sequelize(
  process.env.DB_DBNAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectModule: mysql2,
  }
);

export default db;
