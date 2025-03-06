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
// jose를 이용해 access token 생성 (payload: { id })
const createAccessToken = async (userId) => {
  return await new SignJWT({ userId: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(jwtExpiresInAccess)
    .sign(encodedKey);
};

// jose를 이용해 refresh token 생성 (payload: { id })
const createRefreshToken = async (userId) => {
  return await new SignJWT({ userId: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(jwtExpiresInRefresh)
    .sign(encodedKey);
};

const decrypt = async (session) => {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
  } catch (error) {}
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
  const accessToken = await createAccessToken(foundUser.id);
  const refreshToken = await createRefreshToken(foundUser.id);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.env.nodeEnv === "prod",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // console.log("login res :>> ", res);

  res
    .status(200)
    .json({ data: { nickname: foundUser.nickname, token: accessToken } });
};
