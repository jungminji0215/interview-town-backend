import * as answerRepository from "../data/answerRepository.js";

export const getAnswersByQuestionId = async (req, res, next) => {
  const questionId = req.query.questionId;

  const data = await answerRepository.getAnswersByQuestionId(questionId);
  res.status(200).json(data);
};

export const addAnswer = async (req, res, next) => {
  const { questionId, content } = req.body;

  const data = await answerRepository.addAnswer(questionId, content);
  res.status(200).json(data);
};
