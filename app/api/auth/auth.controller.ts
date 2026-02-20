import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, getSessionFromRequest, setAuthCookie } from "@/lib/auth";
import { AuthError, AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly service = new AuthService()) {}

  async signup(request: NextRequest) {
    try {
      const body = await request.json();
      const { user, token } = await this.service.signup(body);
      const response = NextResponse.json(
        {
          message: "Signup successful.",
          token,
          user,
        },
        { status: 201 }
      );
      setAuthCookie(response, token);
      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      console.error("Signup error:", error);
      return NextResponse.json(
        { message: "Unable to sign up right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async login(request: NextRequest) {
    try {
      const body = await request.json();
      const { user, token } = await this.service.login(body);
      const response = NextResponse.json({
        message: "Login successful.",
        token,
        user,
      });
      setAuthCookie(response, token);
      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        return NextResponse.json({ message: error.message }, { status: error.status });
      }
      console.error("Login error:", error);
      return NextResponse.json(
        { message: "Unable to log in right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async session(request: NextRequest) {
    try {
      const session = getSessionFromRequest(request);
      if (!session?.userId) {
        return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
      }

      const user = await this.service.findUserById(session.userId);
      if (!user) {
        return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
      }

      return NextResponse.json(
        {
          message: "Session active.",
          user,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Session error:", error);
      return NextResponse.json(
        { message: "Unable to verify session right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async logout(_request: NextRequest) {
    try {
      const response = NextResponse.json({ message: "Logged out successfully." }, { status: 200 });
      clearAuthCookie(response);
      return response;
    } catch (error) {
      console.error("Logout error:", error);
      return NextResponse.json(
        { message: "Unable to log out right now. Please try again later." },
        { status: 500 }
      );
    }
  }
}



