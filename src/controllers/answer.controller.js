import {
  createAnswerService,
  fetchMyQuestionsWithLatestAnswer,
  getAnswersByQuestion
} from "../services/answer.service.js";

export const getAnswers = async (req, res) => {
  const questionId = parseInt(req.params.id, 10);
  const page      = parseInt(req.query.page     || '1', 10);
  const pageSize  = parseInt(req.query.pageSize || '10', 10);

  // optionalAuthenticate 가 세팅해 둔 userId
  const meId = req.userId || null;

  try {
    const {
      answers,
      currentPage,
      totalPages,
      totalCount,
    } = await getAnswersByQuestion(questionId, page, pageSize);

    // 각 답변에 isMine 플래그 추가
    const enriched = answers.map(ans => ({
      ...ans,
      isMine: meId !== null && ans.userId === meId,
    }));

    return res.status(200).json({
      data: {
        answers: enriched,
        pagination: { currentPage, totalPages, totalCount },
      },
    });
  } catch (error) {
    console.error('답변 조회 실패:', error);
    return res
      .status(500)
      .json({ message: '답변 조회 중 서버 오류가 발생했습니다.' });
  }
};

export const createAnswer = async (req, res) => {
  const questionId = parseInt(req.params.id, 10);
  const userId = req.userId;
  const { content } = req.body;

  if (!content) {
    return res
      .status(400)
      .json({ message: "내용을 입력해주세요." });
  }

  try {

    const answer = await createAnswerService({ questionId, content, userId });

    return res.status(201).json(answer);
  } catch (error) {
    console.error('답변 등록 실패', error);
    return res
      .status(500)
      .json({ message: '답변 등록 중 서버 오류가 발생했습니다.' });
  }
};


/**
 * [GET] /me/answers
 * • authenticate를 통해 req.userId가 반드시 존재
 *   “내가 답변한 모든 질문 + 각 질문별 최신 답변” 리스트 가져옴
 * • 답변이 하나도 없는 경우, 빈 배열([]) 반환
 */
export const getMyAnswers = async (req, res) => {
  const userId = req.userId;

  try {
    const list = await fetchMyQuestionsWithLatestAnswer(userId);

    return res.status(200).json({
      data: {
        answers: list,
        totalCount: list.length,
      },
    });
  } catch (error) {
    console.error('getMyAnswers 오류:', error);
    return res
      .status(500)
      .json({ message: '내가 답변한 질문 목록을 가져오는 중 서버 오류가 발생했습니다.' });
  }
};