import express from "express";
import * as tagsController from "../controller/tagsController.js";

const router = express.Router();

/**
 * GET /tags?category=frontend
 * 특정 카테고리에 속한 태그 목록 조회
 */
router.get("/", tagsController.getTagsByCategory);

export default router;
