import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type JwtPayload = {
  sub: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
};

export function signToken(
  payload: JwtPayload,
  remember = false
): { token: string; expiresIn: string } {
  const defaultShort = "7d";
  const defaultLong = "30d";
  const expiresIn = remember ? process.env.JWT_REMEMBER_EXPIRES_IN || defaultLong : process.env.JWT_EXPIRES_IN || defaultShort;
  const secret = env.JWT_SECRET;
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
  });
  return { token, expiresIn };
}

export function verifyToken(token: string): JwtPayload {
  const secret = env.JWT_SECRET;
  return jwt.verify(token, secret) as JwtPayload;
}
