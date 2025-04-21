import {getAnswersByQuestion} from "../services/answer.service.js";

export const getAnswers = async (req, res) => {
  const questionId = parseInt(req.params.id);
  const page = parseInt(req.query.page || '1', 10);
  const pageSize = parseInt(req.query.pageSize || '10', 10);

  try {
    const { answers, currentPage, totalPages, totalCount } = await getAnswersByQuestion(
      questionId,
      page,
      pageSize
    );

    res.status(200).json({
      data: {
        answers,
        pagination: {
          currentPage,
          totalPages,
          totalCount,
        },
      },
    });
  } catch (error) {
    console.error('답변 조회 실패:', error);
    res.status(500).json({ message: '답변 조회 중 오류 발생', error: error.message });
  }
};