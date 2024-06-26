import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createToken = (payload: any, role: String) => {
  try {
    const secret_key: String = role === "admin" ? process.env.JWT_SECRET_MANAGE : process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret_key, {
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyToken = (token: string, role: String) => {
  try {
    const secret_key: String = role === "admin" ? process.env.JWT_SECRET_MANAGE : process.env.JWT_SECRET;
    const verify = jwt.verify(token, secret_key);
    return verify;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { createToken, verifyToken };
