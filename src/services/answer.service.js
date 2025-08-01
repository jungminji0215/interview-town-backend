import prisma from '../../prisma/client.js';

/**
 * questionId에 속한 답변 중 userId를 제외한 나머지를 페이지네이션해서 조회
 * meId가 null이면 로그인 안 한 것이므로, 전체 답변을 리턴
 */
export const getAnswersByQuestion = async (questionId, userId,page, pageSize) => {
  const skip = (page - 1) * pageSize;

  // where절: questionId 같고, meId가 있으면 userId != meId, 없으면 그냥 questionId
  const whereClause = userId
    ? { questionId, userId: { not: userId } }
    : { questionId };

  const [answers, totalCount] = await Promise.all([
    prisma.answer.findMany({
      where: whereClause,
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
    prisma.answer.count({ where: whereClause }),
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

/**
 * 로그인 사용자(userId)가 해당 질문(questionId)에 남긴 답변
 */
export async function getMyAnswerByQuestionService(questionId, userId) {
  // [수정] findMany 대신 findFirst를 사용하여 조건에 맞는 첫 번째 레코드 하나만 찾습니다.
  // 해당하는 레코드가 없으면 null을 반환합니다.
  return prisma.answer.findFirst({
    where: {
      questionId,
      userId,
    },
    include: {
      user: {
        select: { id: true, nickname: true},
      },
    },
    // 여러 개가 있을 리 없지만, 만약의 경우를 대비해 최신순으로 정렬
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function updateAnswerService(answerId, userId, content) {
  const answer = await prisma.answer.findUnique({ where: { id: answerId } });

  if (!answer) {
    throw new Error('Answer not found');
  }
  // 답변의 소유자인지 확인
  if (answer.userId !== userId) {
    throw new Error('Not authorized');
  }

  return prisma.answer.update({
    where: { id: answerId },
    data: { content },
  });
}

/**
 * 답변을 삭제합니다.
 * @param {number} answerId - 삭제할 답변의 ID
 * @param {number} userId - 요청한 사용자의 ID (본인 확인용)
 */
export async function deleteAnswerService(answerId, userId) {
  const answer = await prisma.answer.findUnique({ where: { id: answerId } });

  if (!answer) {
    throw new Error('Answer not found');
  }
  // 답변의 소유자인지 확인합니다.
  if (answer.userId !== userId) {
    throw new Error('Not authorized');
  }

  return prisma.answer.delete({
    where: { id: answerId },
  });
}
