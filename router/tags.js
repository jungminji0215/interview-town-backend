import express from "express";
import { getTagsByCategory } from "../data/tags.js";

const router = express.Router();

/**
 * GET /tags?category=frontend
 * 특정 카테고리에 속한 태그 목록 조회
 */
router.get("/", (req, res, next) => {
  const category = req.query.category;
  const data = getTagsByCategory(category);
  res.status(200).json(data);
});

export default router;
