import express from "express";
import {
  getQuestionByCategoryId,
  getQuestionsByCategory,
} from "../data/questions.js";

const router = express.Router();

/**
 * GET /questions?category=frontend
 * 특정 카테고리에 속한 질문 목록 조회
 */
router.get("/", (req, res, next) => {
  const category = req.query.category;
  const data = getQuestionsByCategory(category);
  res.status(200).json(data);
});

/**
 * GET /questions/{questionId}
 * 질문 상세를 조회한다
 */
router.get("/:questionId", (req, res, next) => {
  const { questionId } = req.params;

  const data = getQuestionByCategoryId(questionId);
  res.status(200).json(data);
});

export default router;
