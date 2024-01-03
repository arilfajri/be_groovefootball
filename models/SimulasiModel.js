import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Teknik from "./TeknikModel.js";
const { DataTypes } = Sequelize;

const Simulasi = db.define(
  "simulasi",
  {
    foto_teknik: DataTypes.STRING,
    video_teknik: DataTypes.STRING,
    deskripsi_video: DataTypes.TEXT,
    url: DataTypes.STRING,
    teknikId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Simulasi.belongsTo(Teknik, { foreignKey: "teknikId" }); // Setiap produk dimiliki oleh satu kategori
Teknik.hasMany(Simulasi, { foreignKey: "teknikId" }); // Satu kategori dapat memiliki banyak produk

export default Simulasi;
