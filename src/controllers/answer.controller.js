import {createAnswerService, getAnswersByQuestion} from "../services/answer.service.js";

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

// export const getAnswers = async (req, res) => {
//   const questionId = parseInt(req.params.id);
//   const page = parseInt(req.query.page || '1', 10);
//   const pageSize = parseInt(req.query.pageSize || '10', 10);
//
//   // 1) Authorization 헤더 있으면 토큰 검증해서 userId 획득
//   let meId = null;
//   const authHeader = req.headers.authorization;
//   if (authHeader?.startsWith('Bearer ')) {
//
//
//
//     try {
//       const { userId } = verifyAccessToken(authHeader.split(' ')[1]);
//       // 조회하는 사람
//       console.log("userId : ", userId)
//       meId = userId;
//     } catch {
//       // invalid token 은 그냥 무시
//     }
//   }
//
//   try {
//     // 2) 질문에 달린 답변 조회 (userId 포함되어야 함)
//     const { answers, currentPage, totalPages, totalCount } =
//       await getAnswersByQuestion(questionId, page, pageSize);
//
//     // 3) 각 답변에 isMine 플래그 추가
//     const enriched = answers.map((ans) => ({
//       ...ans,
//       isMine: meId !== null && ans.userId === meId,
//     }));
//
//     return res.status(200).json({
//       data: {
//         answers: enriched,
//         pagination: { currentPage, totalPages, totalCount },
//       },
//     });
//   } catch (error) {
//     console.error('답변 조회 실패:', error);
//     res.status(500).json({ message: '답변 조회 중 서버 오류가 발생했습니다.' });
//   }
// };

export const createAnswer = async (req, res) => {
  const questionId = parseInt(req.params.id, 10);
  const { content, userId } = req.body;


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