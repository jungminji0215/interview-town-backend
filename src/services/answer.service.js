import prisma from '../../prisma/client.js';

/**
 * 질문 ID(questionId)에 달린 답변 목록을 페이징하여 가져옴
 */
export const getAnswersByQuestion = async (questionId, page, pageSize) => {
  const skip = (page - 1) * pageSize;

  const [answers, totalCount] = await Promise.all([
    prisma.answer.findMany({
      where: { questionId },
      orderBy: { id: 'desc' },
      skip,
      take: pageSize,
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    }),
    prisma.answer.count({ where: { questionId } }),
  ]);

  return {
    answers,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};


/**
 * 새 답변 생성하고 저장
 */
export const createAnswerService = async ({ questionId, content, userId }) => {
  return  prisma.answer.create({
    data: {
      content,
      questionId,
      userId,
    },
  });
};

/**
 * 로그인 사용자(userId)가 답변을 남긴 모든 질문(question)을
 * 찾아서, “각 질문별 최신 한 건의 답변”만 반환,
 * 질문의 카테고리 정보도 함께 포함
 *
 * @param {number} userId  - 토큰을 통해 얻어진 로그인된 사용자 ID
 * @returns {Promise<Array<{
 *   questionId: number,
 *   questionTitle: string,
 *   categoryId: number,
 *   categoryName: string,
 *   answerId: number,
 *   content: string,
 *   answeredAt: Date
 * }>>}
 */
export async function fetchMyQuestionsWithLatestAnswer(userId) {
  // userId가 작성한 모든 Answer createdAt 내림차순
  const allAnswers = await prisma.answer.findMany({
    where: { userId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      questionId: true,
      question: {
        select: {
          id: true,
          title: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Map 활용하여 질문(questionId)별 최신 답변 한 건
  const latestByQuestion = new Map();
  for (const ans of allAnswers) {
    const qId = ans.questionId;
    if (!latestByQuestion.has(qId)) {
      latestByQuestion.set(qId, ans);
    }
  }

  const result = [];
  for (const ans of latestByQuestion.values()) {
    result.push({
      questionId: ans.question.id,
      questionTitle: ans.question.title,
      categoryId: ans.question.category.id,
      categoryName: ans.question.category.name,
      answerId: ans.id,
      content: ans.content,
      answeredAt: ans.createdAt,
    });
  }

  return result;
}