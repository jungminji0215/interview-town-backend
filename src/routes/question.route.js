import express from 'express';
import {getQuestionDetail, getQuestions, updateQuestion} from '../controllers/question.controller.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.get('/questions/:id', getQuestionDetail);
router.put('/questions/:id', updateQuestion);

export default router;