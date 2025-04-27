import  prisma  from '../../prisma/client.js';

export const getAllCategories = async () => {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: { id: 'asc' },
  });
};