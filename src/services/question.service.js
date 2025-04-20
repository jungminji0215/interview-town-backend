import prisma from '../../prisma/client.js';

export const getAllQuestions = async (categoryName, page, pageSize) => {
  const where = categoryName
    ? { category: { name: categoryName } }
    : {};

  const [questions, totalCount] = await Promise.all([
    prisma.question.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: 'desc' },
      include: {
        category: true,
      },
    }),
    prisma.question.count({ where }),
  ]);

  return {
    questions,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize),
  };
};