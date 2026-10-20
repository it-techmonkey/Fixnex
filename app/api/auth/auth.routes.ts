import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "./auth.controller";

const controller = new AuthController();

export type RouteHandler = (request: NextRequest) => Promise<NextResponse>;

type RouteGroup = {
  POST?: RouteHandler;
  GET?: RouteHandler;
};

export const authRoutes: Record<string, RouteGroup> = {
  signup: {
    POST: (request: NextRequest) => controller.signup(request),
  },
  login: {
    POST: (request: NextRequest) => controller.login(request),
  },
  "change-password": {
    POST: (request: NextRequest) => controller.changePassword(request),
  },
  "forgot-password": {
    POST: (request: NextRequest) => controller.forgotPassword(request),
  },
  "reset-password": {
    POST: (request: NextRequest) => controller.resetPassword(request),
  },
  session: {
    GET: (request: NextRequest) => controller.session(request),
  },
  logout: {
    POST: (request: NextRequest) => controller.logout(request),
  },
};

