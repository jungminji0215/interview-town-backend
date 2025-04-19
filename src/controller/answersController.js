import * as answerRepository from "../data/answerRepository.js";
import { decrypt } from "./authController.js";

export const getAnswersByQuestionId = async (req, res, next) => {
  const questionId = req.query.questionId;

  const data = await answerRepository.getAnswersByQuestionId(questionId);
  res.status(200).json(data);
};

/** 답변 추가 */
export const addAnswer = async (req, res, next) => {
  try {
    const { questionId, content } = req.body;

    const { data } = await answerRepository.addAnswer(questionId, content);

    const { answer } = data;
  } catch (error) {
    next(error);
  }
};
