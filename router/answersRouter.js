import express from "express";
import * as answersController from "../controller/answersController.js";

const router = express.Router();

/**
 * GET /{questionId}
 * 답변 상세를 조회한다
 */
router.get("/", answersController.getAnswersByQuestionId);

/**
 * 답변 등록
 */
router.post("/", answersController.addAnswer);

export default router;
