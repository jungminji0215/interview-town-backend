import {getAllQuestions, getQuestionById, updateQuestionById} from '../services/question.service.js';

export const getQuestions = async (req, res) => {
  try {
    const { category } = req.query;
    // 변경: page/pageSize가 없으면 undefined, 숫자로만 변환
    const page = req.query.page ? Number(req.query.page) : undefined;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;

    const result = await getAllQuestions(category, page, pageSize);
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

export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).json({ message: '수정할 제목이나 내용이 필요합니다.' });
  }

  try {
    const updatedQuestion = await updateQuestionById(id, { title, content });
    res.status(200).json({ data: updatedQuestion, message: '질문이 성공적으로 수정되었습니다.' });
  } catch (error) {
    console.error('질문 수정 실패:', error);
    if (error.message === '질문을 찾을 수 없습니다.') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
