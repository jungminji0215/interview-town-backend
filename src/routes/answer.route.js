import express from 'express';
import {getAnswers} from '../controllers/answer.controller.js';

const router = express.Router();

router.get('/questions/:id/answers', getAnswers);

export default router;