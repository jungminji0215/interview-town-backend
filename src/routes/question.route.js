import express from 'express';
import {getQuestionDetail, getQuestions} from '../controllers/question.controller.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.get('/questions/:id', getQuestionDetail);

export default router;