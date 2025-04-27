import prisma from '../../prisma/client.js';

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


export const createAnswerService = async ({ questionId, content, userId }) => {
  console.log("questionId : ", questionId)
  console.log("content : ", content)
  console.log("userId : ", userId)
  return  prisma.answer.create({
    data: {
      content,
      questionId,
      userId,
    },
  });
};