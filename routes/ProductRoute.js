import express from "express";
import {
  getProducts,
  getProductById,
  saveProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  getCategories,
  getAllData,
  getAllDataById,
} from "../controllers/ProductController.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/categories", getCategories);
router.get("/alldata", getAllData);
router.get("/alldata/:id", getAllDataById);
router.get("/products/:id", getProductById);
router.post("/products", saveProduct);
router.post("/category", addCategory);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
