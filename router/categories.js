import express from "express";
import * as categoryRepository from "../data/category";

const router = express.Router();

/**
 * GET /categories
 * 카테고리 목록 전체 조회
 */
router.get("/", (req, res, next) => {
  const data = categoryRepository.getAllCategories();
  res.status(200).json(data);
});

export default router;
