import prisma from '../../prisma/client.js';

export const getAllQuestions = async (categoryName, page, pageSize) => {
  const where = categoryName && categoryName !== 'all'
    ? { category: { name: categoryName } }
    : {};

  // 변경: page, pageSize 둘 다 숫자로 넘어온 경우에만 skip/take 적용
  if (typeof page === 'number' && typeof pageSize === 'number') {
    const [questions, totalCount] = await Promise.all([
      prisma.question.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'desc' },
        include: { category: true },
      }),
      prisma.question.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);
    return {
      questions,
      totalCount,
      currentPage: page,
      totalPages,
    };
  }

  // 변경: pagination 파라미터 없으면 전체 조회
  const questions = await prisma.question.findMany({
    where,
    orderBy: { id: 'desc' },
    include: { category: true },
  });
  const totalCount = questions.length;
  return {
    questions,
    totalCount,
    currentPage: 1,
    totalPages: 1,
  };
};


export const getQuestionById = async (id) => {
  const question = await prisma.question.findUnique({
    where: { id: Number(id) },
    include: {
      category: true,
    },
  });

  return question;
};