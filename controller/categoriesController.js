import * as categoryRepository from "../data/categoryRepository.js";

export const getAllCategories = async (req, res, next) => {
  const data = await categoryRepository.getAllCategories();
  res.status(200).json(data);
};
