import express from "express";
import FileUpload from "express-fileupload";
import cors from "cors";
import Route from "./routes/Route.js";
import db from "./config/Database.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     "https://fe-groovefootball.vercel.app"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.header("Access-Control-Allow-Credentials", "true"); // Setel ke 'true'
//   next();
// });

app.use(
  cors({ credentials: true, origin: "https://fe-groovefootball.vercel.app" })
);

app.use(cookieParser());
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(Route);
app.use("/images", express.static(path.join(__dirname, "public/images")));

try {
  await db.authenticate();
  console.log("Database connected.....");
} catch (error) {
  console.error(error);
}
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is running....");
});
