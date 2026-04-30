// src/routes/users.routes.js
import { Router } from "express";
import { getUserDashboard } from "../controllers/users.controller.js";

const router = Router();

router.get("/me/dashboard", getUserDashboard);

export default router;
