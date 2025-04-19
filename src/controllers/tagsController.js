import * as tagRepository from "../data/tagRepository.js";

export const getTagsByCategory = async (req, res, next) => {
  const category = req.query.category;
  const data = await tagRepository.getTagsByCategory(category);
  res.status(200).json(data);
};
