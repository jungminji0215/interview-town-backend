import * as userRepository from "../data/userRepository.js";
import bcrypt from "bcrypt";
import { jwtVerify, SignJWT } from "jose";
import { config } from "../config.js";

const secretKey = "30ScfeXUBz4ugvRVGFWYVCrVjDYgwH0E";
const jwtExpiresInAccess = "2d"; // access token 만료 시간
const jwtExpiresInRefresh = "7d"; // refresh token 만료 시간
const encodedKey = new TextEncoder().encode(secretKey);
const bcryptSaltRounds = 12;

const encrypt = async (payload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
};

// TODO 중복제거
const createAccessToken = async ({ id, user_id, nickname }) => {
  return await new SignJWT({ user: { id, userId: user_id, nickname } })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(jwtExpiresInAccess)
    .sign(encodedKey);
};

// jose를 이용해 refresh token 생성 (payload: { id })
const createRefreshToken = async ({ id, user_id, nickname }) => {
  return await new SignJWT({ user: { id, userId: user_id, nickname } })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(jwtExpiresInRefresh)
    .sign(encodedKey);
};

export const decrypt = async (session) => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {}
};

// 미들웨어: access token 검증 (요청 헤더의 Bearer 토큰)
export async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// TODO 만료되면 토큰 다시 생성
export const getSession = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return null;

  // TODO 리팩토링
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  const decryptToken = await decrypt(token);

  res.status(200).json({ data: decryptToken });
};

// 회원가입: 사용자를 생성하고, access token은 JSON 응답, refresh token은 httpOnly 쿠키로 설정
export const signup = async (req, res, next) => {
  const { userId, password, nickname } = req.body;
  const foundUser = await userRepository.findByUserId(userId);

  if (foundUser && foundUser.length > 0) {
    return res.status(409).json({ message: `${userId} already exists` });
  }

  const hashed = await bcrypt.hash(password, bcryptSaltRounds);
  const newUser = await userRepository.createUser({
    userId,
    password: hashed,
    nickname,
  });

  // TODO 회원가입 시 자동 로그인
  // refresh token은 보안상의 이유로 httpOnly 쿠키로 저장 (production 환경에서는 secure:true)
  // res.cookie("refreshToken", refreshToken, {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "lax",
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
  // });

  // res.status(200).json({
  //   data: { user: { nickname: newUser.nickname, token: accessToken } },
  // });

  res.status(200).json({ data: { nickname: newUser.nickname } });
};

export const login = async (req, res, next) => {
  const { userId, password } = req.body;
  const user = await userRepository.findByUserId(userId);

  if (!user) {
    return res.status(401).json({ message: "Invalid user or password" });
  }

  const isValidPassword = await bcrypt.compare(password, user[0].password);

  if (!isValidPassword) {
    return res.status(401).json({ message: "Invalid user or password" });
  }

  const foundUser = user[0];

  // 여기서 토큰 만들어서 주기
  // refreshToken : HTTP Only Cookies 에 담아서 전달
  // accessToken : json payload 에 담아서 전달
  const accessToken = await createAccessToken(foundUser);
  const refreshToken = await createRefreshToken(foundUser);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.env.nodeEnv === "prod",
    sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json({ data: { nickname: foundUser.nickname, token: accessToken } });
};
