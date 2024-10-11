import { Router } from "express";
import { createUsers, deleteUsers, getUsers } from "../controllers/userController.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUsers);
router.delete("/", deleteUsers)

export default router;