import { comparePassword, hashPassword } from "../libs/hash.js";
import { PrismaClient } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../libs/jwt.js";

const prisma = new PrismaClient();

const isProd = process.env.NODE_ENV === 'production';


const generateNickname = () => {
 return crypto.randomUUID().slice(0, 8)
};

export const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const isExistUser = await prisma.user.findUnique({ where: { email } });
    if (isExistUser) {
      return res.status(401).json({ message: "user_exist" });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname: generateNickname()
      },
    });

    return res.status(201).json({ message: "success" });
  } catch (err) {
    console.error("회원가입 오류:", err);
    res.status(500).json({ message: "server_error" });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(401) // 401 Unauthorized
        .json({ message: "invalid_credentials" });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "invalid_credentials" }); // "이메일 또는 비밀번호가 잘못되었습니다.
    }

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // accessToken (15분)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain:   isProd ? '.interview-town.com' : undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    // refreshToken 7일
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain:   isProd ? '.interview-town.com' : undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      user:{
        id: user.id,
        nickname:user.nickname,
        email : user.email
      }
    });
  } catch (error) {
    console.error("siginin error", error);
    res.status(500).json({ message: "server_error" });
  }
};


export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  console.log("token : ", token)

  if (!token) {
    return res.status(401).json({ message: "not_exist_token" });
  }

  try {
    const  { userId } = verifyRefreshToken(token);

    const newAccessToken = generateAccessToken({ userId});
    const newRefreshToken = generateAccessToken({ userId});

    /**
     * 쿠키 재설정(롤링, rolling)
     * 리프레시 토큰 롤링이란 리프레시 토큰을 사용할 때마다 새로운 리프레시 토큰을 발급하고,
     * 이전 토큰을 만료시키는 보안 기법
     */
    // 쿠키 재설정 (롤링)
    res.cookie("accessToken",  newAccessToken);
    res.cookie("refreshToken", newRefreshToken);

    // 204 : No Content : 요청을 설공적으로 처리했으니, 돌려줄 바디가 없다.
    return res.status(204)

  } catch (error) {
    console.error("refreshToken error:", error);
    return res.status(401).json({ message: "invalid_token" });
  }
};

export const getMe = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'not_logged_in' });
  }

  try {
    const { userId } = verifyRefreshToken(token);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true , nickname: true },
    });

    if (!user) {
      return res.status(404).json({ message: "not_exist_user" });
    }

    // res.status(200).json({ user });
    res.status(200).json({ user: { id: user.id, nickname: user.nickname, email: user.email } });

  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "server_error" });
  }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain:   isProd ? '.interview-town.com' : undefined,
    });

    return res.status(200).json({ message: "success_signout" });
  } catch (err) {
    console.error("signout error:", err);
    res.status(500).json({ message: "server_error" });
  }
};

export const getSession = async (req, res) => {
  const token = req.cookies.refreshToken; // cookie-parser 필요함

  if (!token) return res.json({ isLoggedIn: false });

  try {
    // 1. refreshToken 검증
    const { userId } = verifyRefreshToken(token);

    // 2. 새로운 accessToken 발급
    const accessToken = generateAccessToken({ userId });

    // 3. 사용자 정보 조회 (id, email, nickname)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, nickname: true },
    });

    if (!user) {
      // 혹시 user가 없는 경우 (비정상)
      return res.status(200).json({ isLoggedIn: false });
    }

    return res.status(200).json({
      isLoggedIn: true,
      accessToken,
      user,
    });
  } catch (error) {
    console.error("getSession 오류:", error);
    return res.status(401).json({ isLoggedIn: false });
  }
};

/**
 * catch (error) {
 *     console.error("getSession 오류:", error);
 *     res.status(500).json({ message: err.message });
 *   }
 */