import { verifyAccessToken } from "../libs/jwt.js";

// export const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res
//       .status(401)
//       .json({ message: "AccessToken이 제공되지 않았습니다.'" });
//   }
//
//   const token = authHeader.split(" ")[1];
//
//   try {
//     const decoded = verifyAccessToken(token);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
//   }
// };

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'not_exist_token' });
  }
  try {
    const { userId } = verifyAccessToken(authHeader.split(' ')[1]);
    req.userId = userId;
    next();
  } catch {
    return res.status(401).json({ message: 'invalid_token' });
  }
};

/**
 * 헤더가 없으면 그냥 next()
 * 토큰이 유요하면 req.userId 에 세팅
 * 토큰이 만료 혹은 오류면 무시하고 넘어감(로그인 안 한 사용자 취급)
 */
export const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifyAccessToken(token);
      req.userId = decoded.userId;
    } catch {
      // invalid token 은 그냥 무시
    }
  }
  next();
};