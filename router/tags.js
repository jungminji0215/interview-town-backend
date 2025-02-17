import express from "express";

const tags = {
  tags: [
    { id: 101, name: "javascript" },
    { id: 102, name: "react" },
    { id: 103, name: "css" },
  ],
};

const router = express.Router();

/**
 * GET /tags?category=frontend
 * 특정 카테고리에 속한 태그 목록 조회
 */
router.get("/", (req, res, next) => {
  const category = req.query.category;

  res.status(200).json(tags);
});

export default router;
