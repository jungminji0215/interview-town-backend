import express from "express";
import * as categoriesController from "../controller/categoriesController.js";

const router = express.Router();

/**
 * GET /categories
 * 카테고리 목록 전체 조회
 */
router.get("/", categoriesController.getAllCategories);

export default router;
