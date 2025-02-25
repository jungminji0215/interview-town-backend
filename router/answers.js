import express from "express";
import { getAnswersByQuestionId } from "../data/answers.js";

const router = express.Router();

/**
 * GET /{answerId}
 * 질문 상세를 조회한다
 */
router.get("/:answerId", (req, res, next) => {
  const { answerId } = req.params;
  console.log("answerId :>> ", answerId);

  const data = getAnswersByQuestionId(answerId);
  res.status(200).json(data);
});

export default router;
