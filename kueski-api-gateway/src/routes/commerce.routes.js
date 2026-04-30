// src/routes/commerce.routes.js
import { Router } from "express";
import { checkBenefits } from "../controllers/commerce.controller.js";

const router = Router();

// Definimos la ruta.
// Nota que ya no escribimos "/commerce/benefits", solo "/benefits"
// porque agruparemos todo lo que sea de "commerce" desde el index.js
router.get("/check", checkBenefits);

export default router;
