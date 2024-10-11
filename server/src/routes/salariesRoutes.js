import { Router } from "express";
import { getSalaries, createSalaries, deleteSalaries } from '../controllers/salariesController.js';

const router = Router();

router.get("/", getSalaries);
router.post("/", createSalaries);
router.delete("/", deleteSalaries);

export default router;