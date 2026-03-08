import express from "express";
const router = express.Router();
import { createComment, updateComment, deleteComment } from "../controllers/commentController.js";

router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

export default router;