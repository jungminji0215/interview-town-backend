import * as answerRepository from "../data/answerRepository.js";

export const getAnswersByQuestionId = async (req, res, next) => {
  const questionId = req.query.questionId;

  const data = await answerRepository.getAnswersByQuestionId(questionId);
  res.status(200).json(data);
};
