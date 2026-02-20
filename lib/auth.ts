import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextRequest, NextResponse } from "next/server";

export const TOKEN_COOKIE_NAME = "fixnex_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === "change-me-please") {
    throw new Error("JWT_SECRET environment variable is not set.");
  }
  return secret;
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const signAuthToken = (payload: object): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_TTL_SECONDS });
};

export const setAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TOKEN_TTL_SECONDS,
    path: "/",
  });
};

export const clearAuthCookie = (response: NextResponse) => {
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });
};

export type AuthTokenPayload = jwt.JwtPayload & {
  userId: string;
};

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
};

export const getAuthTokenFromRequest = (request: NextRequest): string | null => {
  return request.cookies.get(TOKEN_COOKIE_NAME)?.value ?? null;
};

export const getSessionFromRequest = (request: NextRequest): AuthTokenPayload | null => {
  const token = getAuthTokenFromRequest(request);
  if (!token) {
    return null;
  }

  try {
    return verifyAuthToken(token);
  } catch {
    return null;
  }
};

