import express from "express";
const router = express.Router();

import { signupUser, loginUser } from "../controllers/authController.js";

router.post("/signup", signupUser);
router.post("/login", loginUser);

export default router;