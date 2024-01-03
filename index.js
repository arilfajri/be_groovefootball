import express from "express";
import FileUpload from "express-fileupload";
import cors from "cors";
import Route from "./routes/Route.js";
import db from "./config/Database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(Route);

try {
  await db.authenticate();
  console.log("Database connected....");
} catch (error) {
  console.error(error);
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running....");
});
