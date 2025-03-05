import * as userRepository from "../data/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtSecretKey = "30ScfeXUBz4ugvRVGFWYVCrVjDYgwH0E";
const jwtExpiresInDays = "2d";
const bcryptSaltRounds = 12;

const createJwtToken = (id) => {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: jwtExpiresInDays });
};

export const signup = async (req, res, next) => {
  const { userId, password, nickname } = req.body;
  const foundUser = await userRepository.findByUserId(userId);

  if (foundUser.length < 0) {
    return res.status(409).json({ message: `${userId} already exists` });
  }

  const hashed = await bcrypt.hash(password, bcryptSaltRounds);
  const newUser = await userRepository.createUser({
    userId,
    password: hashed,
    nickname,
  });

  const token = createJwtToken(newUser);

  res
    .status(200)
    .json({ data: { user: { nickname: newUser.nickname, token } } });
};

export const login = async (req, res, next) => {
  const { userId, password } = req.body;
  const user = await userRepository.findByUserId(userId);

  // if (!user) {
  //   return res.status(401).json({ message: "Invalid user or password" });
  // }

  const isValidPassword = await bcrypt.compare(password, user[0].password);

  // if (!isValidPassword) {
  //   return res.status(401).json({ message: "Invalid user or password" });
  // }

  const foundUser = user[0];

  const token = createJwtToken(user.userId);

  res
    .status(200)
    .json({ data: { user: { nickname: foundUser.nickname, token } } });
};
