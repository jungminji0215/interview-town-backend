import express from "express";

import * as questionsController from "../controller/questionsController.js";

const router = express.Router();

/**
 * GET /questions?category=frontend
 * 특정 카테고리에 속한 질문 목록 조회
 */
router.get("/", questionsController.getQuestionsByCategory);

/**
 * GET /questions/{questionId}
 * 질문 상세를 조회한다
 */
router.get("/:questionId", questionsController.getQuestionById);

export default router;
