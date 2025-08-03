import express from 'express';
import {
  deleteAnswerController,
  getAnswers,
  getMyAnswers,
  getMyAnswersByQuestion, updateAnswerController
} from '../controllers/answer.controller.js';
import { createAnswer } from '../controllers/answer.controller.js';
import {authenticate} from "../middlewares/auth.middleware.js";

const router = express.Router();

// 모두가 볼 수 있지만, 토큰이 있으면 req.userId 세팅
// router.get('/questions/:id/answers', optionalAuthenticate, getAnswers);
router.get('/questions/:id/answers', getAnswers);

// 답변 등록은 로그인(토큰) 필수
router.post('/questions/:id/answers', authenticate, createAnswer);

// 내 답변 전부 조회 (로그인 필수)
router.get('/questions/:id/answers/me',authenticate, getMyAnswersByQuestion);


router.put('/answers/:id', authenticate, updateAnswerController);
router.delete('/answers/:id', authenticate, deleteAnswerController);


// 삭제 OR 수정
// 내가 답변 남긴 질문
router.get('/me/answers', authenticate, getMyAnswers);

export default router;