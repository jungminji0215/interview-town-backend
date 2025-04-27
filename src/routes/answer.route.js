import express from 'express';
import {getAnswers} from '../controllers/answer.controller.js';
import { createAnswer } from '../controllers/answer.controller.js';

const router = express.Router();

router.get('/questions/:id/answers', getAnswers);
router.post('/questions/:id/answers', createAnswer);

export default router;