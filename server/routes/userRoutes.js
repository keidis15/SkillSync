import expres from "express";
import { createUser, getUsers, loginUser, updateUser } from "../controllers/userController.js";

const router = expres.Router();

router.post("/", createUser); // POST http://localhost:3000/api/users
router.get("/", getUsers);   // GET http://localhost:3000/api/users
router.post('/login', loginUser);
router.put("/:id", updateUser);


export default router;