import { Sequelize } from "sequelize";
import db from "../config/Database.js";
const { DataTypes } = Sequelize;

const Teknik = db.define(
  "teknik",
  {
    nama_teknik: DataTypes.STRING,
    deskripsi_teknik: DataTypes.TEXT,
    tingkat_kesulitan: DataTypes.STRING,
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Teknik;
