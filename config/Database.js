import { Sequelize } from "sequelize";

const db = new Sequelize("db_groovefootball", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
