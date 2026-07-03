import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../auth.service";
import { setAuthCookie } from "@/lib/auth";

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential } = body;

    if (!credential) {
      return NextResponse.json(
        { message: "Google credential is required." },
        { status: 400 }
      );
    }

    const { user, token } = await authService.googleLogin(credential);

    const response = NextResponse.json(
      {
        message: "Login successful.",
        user,
        token,
      },
      { status: 200 }
    );
    
    setAuthCookie(response, token);
    
    return response;
  } catch (error: any) {
    console.error("Google login error:", error);
    
    // Check if it's our custom AuthError
    if (error.name === "AuthError" || error.status) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status || 400 }
      );
    }

    return NextResponse.json(
      { message: "An unexpected error occurred during Google login." },
      { status: 500 }
    );
  }
}
