import { verifyAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { getToken } from 'next-auth/jwt';

const secret = process.env.JWT_ACCESS_SECRET;
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

export const authenticate = async (req, res, next) => {
  console.log("authenticate");
  try {
    // getToken 함수가 요청(req)에 담긴 쿠키를 자동으로 파싱하고,
    // secret 키를 사용해 토큰을 복호화 및 검증합니다.
    const decodedToken = await getToken({ req, secret });

    // 토큰이 유효하지 않거나 없는 경우
    if (!decodedToken) {
      return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
    }

    // 해독된 토큰의 정보를 req 객체에 추가하여 다음 미들웨어나 핸들러로 전달
    // Auth.js 콜백에서 token.id = user.id 와 같이 설정했다면 decodedToken.id 로 접근 가능
    req.userId = Number(decodedToken.sub);
    next();
  } catch(error) {
    console.error('인증 미들웨어 오류:', error);
    return res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
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