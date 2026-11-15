// authRoutes.ts
// STEP 18 and STEP 19: Authentication routes

import { Router } from "express";

import {
  checkEmail,
  checkResetToken,
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
  sendVerification,
  verifyEmail,
} from "../controllers/authController";

import { protect } from "../middleware/auth";

const router = Router();

// Registration and login
router.post("/register", register);
router.post("/login", login);

// Email availability
router.get("/check-email", checkEmail);

// Protected account routes
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", checkResetToken);
router.post("/reset-password/:token", resetPassword);

// Email verification routes
router.post("/send-verification", protect, sendVerification);
router.post("/verify-email", protect, verifyEmail);

export default router;
