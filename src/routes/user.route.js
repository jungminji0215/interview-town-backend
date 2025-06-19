import express from 'express';
import { updateNickname } from '../controllers/user.controller.js';
import {authenticate} from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * 넥네임 수정
 */
router.patch('/me/nickname', authenticate, updateNickname);


export default router;