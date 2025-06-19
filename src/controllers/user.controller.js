import { updateNicknameById } from '../services/user.service.js';

/**
 * PATCH /me/nickname
 * 로그인한 유저의 닉네임 수정
 */
export const updateNickname = async (req, res) => {
  try {
    const userId = req.userId;
    const { nickname } = req.body;

    // 유효성 검사
    if (!nickname || typeof nickname !== 'string') {
      return res
        .status(400)
        .json({ message: 'invalid_nickname' });
    }

    await updateNicknameById(userId, nickname);
    return res
      .status(200)
      .json({ message: 'success' });
  } catch (error) {
    console.error('error_update_nickname:', error);
    return res
      .status(500)
      .json({ message: 'server_error' });
  }
};
