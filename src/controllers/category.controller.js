import { getAllCategories } from '../services/category.service.js';

export const getCategories = async (_req, res) => {
  try {
    const categories = await getAllCategories();
    res.json({ data: { categories } });
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};