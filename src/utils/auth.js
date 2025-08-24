import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();
const SERECT = process.env.JWT_SECRET_KEY;
const expiresIn = process.env.JWT_EXPIRE_IN;

export const signToken = (user) => {
  const { id, name } = user;
  return jwt.sign({ id, name }, SERECT, { expiresIn: expiresIn });
};

export const comparePassWord = async (candidatePassWord, userPassWord) => {
  return await bcrypt.compare(candidatePassWord, userPassWord);
};
