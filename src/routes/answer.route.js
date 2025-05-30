import express from 'express';
import {getAnswers} from '../controllers/answer.controller.js';
import { createAnswer } from '../controllers/answer.controller.js';
import {authenticate, optionalAuthenticate} from "../middlewares/auth.middleware.js";

const router = express.Router();

// 모두가 볼 수 있지만, 토큰이 있으면 req.userId 세팅
router.get('/questions/:id/answers', optionalAuthenticate, getAnswers);

// 답변 등록은 로그인(토큰) 필수
router.post('/questions/:id/answers', authenticate, createAnswer);

export default router;