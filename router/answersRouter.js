import express from "express";
import * as answersController from "../controller/answersController.js";

const router = express.Router();

/**
 * GET /{questionId}
 * 질문 상세를 조회한다
 */
router.get("/", answersController.getAnswersByQuestionId);

export default router;
