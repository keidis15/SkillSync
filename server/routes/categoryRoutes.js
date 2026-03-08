import expres from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";

const router = expres.Router();

// Definimos los "endpoints"
router.post("/", createCategory); // POST http://localhost:3000/api/categories
router.get("/", getCategories);   // GET http://localhost:3000/api/categories

export default router;