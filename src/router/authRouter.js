import express from "express";
import * as authController from "../controller/authController.js";
import { body } from "express-validator";

const router = express.Router();

const validateCredential = [
  body("userId")
    .trim()
    .notEmpty()
    .withMessage("userId should be at least 5 characters"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("username should be at least 5 characters"),
  //   validate,
];

const validateSignup = [
  ...validateCredential,
  body("username").notEmpty().withMessage("username is missing"),
  //   validate,
];

router.post("/signup", validateSignup, authController.signup);
router.post("/login", validateCredential, authController.login);
router.get("/session", authController.getSession);
// router.get("/session", verifyToken, getSession);

export default router;
