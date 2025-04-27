import {getAllQuestions, getQuestionById} from '../services/question.service.js';

export const getQuestions = async (req, res) => {
  try {
    const { category, page = 1, pageSize = 10 } = req.query;
    const result = await getAllQuestions(category, Number(page), Number(pageSize));
    res.status(200).json({ data: result });
  } catch (error) {
    console.error('질문 조회 실패:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};


export const getQuestionDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const question = await getQuestionById(id);

    if (!question) {
      return res.status(404).json({ message: '질문을 찾을 수 없습니다.' });
    }

    res.status(200).json({ data: question });
  } catch (error) {
    console.error('질문 상세 조회 실패:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.'});
  }
};