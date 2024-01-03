import express from "express";
import {
  getAllTeknik,
  getTeknikById,
} from "../controllers/TeknikController.js";
import {
  getAllSimulasi,
  getSimulasiById,
} from "../controllers/SimulasiController.js";
import {
  addTeknikWithSimulasi,
  getAllTeknikWithSimulasi,
  getAllTeknikWithSimulasiById,
  updateTeknikWithSimulasi,
} from "../controllers/TeknikWithSimulasiController.js";
import {
  Login,
  Logout,
  Register,
  getAllAdmin,
} from "../controllers/AdminController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/teknik", getAllTeknik);
router.get("/alldata", getAllTeknikWithSimulasi);
router.post("/alldata", addTeknikWithSimulasi);
router.patch("/alldata/:id", updateTeknikWithSimulasi);
router.get("/alldata/:id", getAllTeknikWithSimulasiById);
router.get("/teknik/:id", getTeknikById);
router.get("/simulasi", getAllSimulasi);
router.get("/simulasi/:id", getSimulasiById);
router.get("/admin", verifyToken, getAllAdmin);
router.post("/admin", Register);
router.post("/login", Login);
router.get("/token", refreshToken);
router.delete("/logout", Logout);

export default router;
