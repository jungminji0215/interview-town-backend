import * as questionRepository from "../data/questionRepository.js";

export const getQuestionsByCategory = async (req, res, next) => {
  const category = req.query.category;
  const page = req.query.page;
  const pageSize = req.query.pageSize;

  console.log("========== page :>> ", page);
  console.log("========== pageSize :>> ", pageSize);

  const data = await questionRepository.getQuestionsByCategory(
    category,
    page,
    pageSize
  );

  res.status(200).json(data);
};
