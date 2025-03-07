import * as answerRepository from "../data/answerRepository.js";
import { decrypt } from "./authController.js";

export const getAnswersByQuestionId = async (req, res, next) => {
  const questionId = req.query.questionId;

  const data = await answerRepository.getAnswersByQuestionId(questionId);
  res.status(200).json(data);
};

export const addAnswer = async (req, res, next) => {
  try {
    const { questionId, content } = req.body;
    const authHeader = req.headers["authorization"];

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const { user } = await decrypt(token);

    const { data } = await answerRepository.addAnswer(
      questionId,
      user.id,
      content
    );
    const { answer } = data;

    // 새 답변을 받으면, req.app.locals.io 에 접근하여 특정 질문의 룸(question_1) 으로
    // "newAnswer" 이벤트를 emit 한다.
    req.app.locals.io.to(`question_${questionId}`).emit("newAnswer", answer);
  } catch (error) {
    next(error);
  }
};
