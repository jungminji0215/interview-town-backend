import prisma from '../../prisma/client.js';

/**
 * 사용자 ID 기반 닉네임 업데이트
 * @param {number} userId - 사용자 고유 ID
 * @param {string} nickname - 새로운 닉네임
 */
export const updateNicknameById = async (userId, nickname) => {
  return prisma.user.update({
    where: { id: userId },
    data: { nickname },
  });
};
