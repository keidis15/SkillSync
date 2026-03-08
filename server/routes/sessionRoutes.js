import express from "express";
import { createSession, getSessions, deleteSession,updateSession, getSessionById } from "../controllers/sessionController.js";
const router = express.Router();

router.post("/", createSession);
router.get("/", getSessions);
router.delete("/:id", deleteSession); // DELETE http://localhost:3000/api/sessions/1
router.put("/:id", updateSession); // PUT http://localhost:3000/api/sessions/1
router.get("/:id", getSessionById); // GET http://localhost:3000/api/sessions/5

export default router;