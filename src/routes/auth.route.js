import express from "express";
import {
  signin,
  signup,
  refreshToken,
  getMe,
  signout, getSession,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {body} from "express-validator";
import {validate} from "../middlewares/validator.js";

const router = express.Router();

const validateAuth =   [
    body("email")
      .isEmail()
      .withMessage("invalid_email")
      .normalizeEmail()
    ,
    body("password")
      .isLength({ min: 6 })
      .withMessage("password_too_short"),
    validate
  ]

router.post("/signup", validateAuth, signup);
router.post("/signin", signin);
router.post("/signout", authenticate, signout);

router.get("/refreshToken", refreshToken);
router.get("/session", getSession);
router.get("/me", getMe);

export default router;
