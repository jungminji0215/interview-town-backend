import prisma from '../../prisma/client.js';

export const getAnswersByQuestion = async (questionId, page, pageSize) => {
  const skip = (page - 1) * pageSize;

  const [answers, totalCount] = await Promise.all([
    prisma.answer.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
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