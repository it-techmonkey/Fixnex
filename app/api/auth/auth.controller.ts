import { after, NextRequest, NextResponse } from "next/server";
import { clearAuthCookie, setAuthCookie, signAuthToken } from "@/lib/auth";
import { getAppBaseUrl, getClientIp, isSameOrigin } from "@/lib/requestMeta";
import { getVerifiedUser } from "@/lib/session";
import { resend } from "@/lib/resend";
import { AuthError, AuthService } from "./auth.service";
import { PasswordService, RESET_TOKEN_TTL_MINUTES } from "./password.service";

const forbiddenOrigin = () =>
  NextResponse.json({ message: "Request blocked." }, { status: 403 });

const errorResponse = (error: AuthError) =>
  NextResponse.json(
    { message: error.message },
    {
      status: error.status,
      headers: error.status === 429 ? { "Retry-After": "900" } : undefined,
    }
  );

export class AuthController {
  constructor(
    private readonly service = new AuthService(),
    private readonly passwords = new PasswordService()
  ) {}

  async signup(request: NextRequest) {
    try {
      const body = await request.json();
      const { user, token } = await this.service.signup(body);
      const response = NextResponse.json(
        {
          message: "Signup successful.",
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
      const { user, token } = await this.service.login(body, { ip: getClientIp(request) });
      const response = NextResponse.json({
        message: "Login successful.",
        user,
      });
      setAuthCookie(response, token);
      return response;
    } catch (error) {
      if (error instanceof AuthError) {
        return errorResponse(error);
      }
      console.error("Login error:", error);
      const msg =
        error instanceof Error && error.message.includes("JWT_SECRET")
          ? "Server configuration error: JWT_SECRET is not set. Add it in Vercel (or your host) Environment Variables."
          : "Unable to log in right now. Please try again later.";
      return NextResponse.json({ message: msg }, { status: 500 });
    }
  }

  async session(request: NextRequest) {
    try {
      const verified = await getVerifiedUser(request);
      if (!verified) {
        return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
      }

      const user = await this.service.findUserById(verified.id);
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

  /** Change password for the signed-in user. Keeps this device signed in. */
  async changePassword(request: NextRequest) {
    try {
      if (!isSameOrigin(request)) return forbiddenOrigin();

      const user = await getVerifiedUser(request);
      if (!user) {
        return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
      }

      const body = await request.json();
      await this.passwords.changePassword(user.id, body);

      // Sessions on other devices are now invalid; give this one a fresh token.
      const response = NextResponse.json({ message: "Password updated." }, { status: 200 });
      setAuthCookie(response, signAuthToken({ userId: user.id }));
      return response;
    } catch (error) {
      if (error instanceof AuthError) return errorResponse(error);
      console.error("Change password error:", error);
      return NextResponse.json(
        { message: "Unable to change the password right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  /** Sends a reset link. Always answers the same way so emails cannot be probed. */
  async forgotPassword(request: NextRequest) {
    const genericResponse = () =>
      NextResponse.json(
        { message: "If an account exists for that email, we have sent a password reset link." },
        { status: 200 }
      );

    try {
      if (!isSameOrigin(request)) return forbiddenOrigin();

      const body = await request.json();
      const reset = await this.passwords.createResetToken(body?.email, getClientIp(request));

      if (reset) {
        const resetUrl = `${getAppBaseUrl(request)}/reset-password?token=${reset.token}`;
        // Sent after the response so timing does not reveal whether the account exists.
        after(async () => {
          try {
            const [{ render }, { PasswordResetEmail }] = await Promise.all([
              import("@react-email/components"),
              import("@/app/components/emails/PasswordResetEmail"),
            ]);
            const html = await render(
              PasswordResetEmail({
                name: reset.fullName,
                resetUrl,
                expiresInMinutes: RESET_TOKEN_TTL_MINUTES,
              })
            );
            const result = await resend.emails.send({
              from: process.env.AUTH_FROM_EMAIL ?? "Fixnex <payment@fixnex.ae>",
              to: reset.email,
              subject: "Reset your Fixnex password",
              html,
            });
            if (result.error) console.error("Password reset email failed:", result.error);
          } catch (emailError) {
            console.error("Password reset email failed:", emailError);
          }
        });
      }
      return genericResponse();
    } catch (error) {
      console.error("Forgot password error:", error);
      return genericResponse();
    }
  }

  /** Sets a new password from an emailed reset link and signs out every device. */
  async resetPassword(request: NextRequest) {
    try {
      if (!isSameOrigin(request)) return forbiddenOrigin();

      const body = await request.json();
      await this.passwords.resetPassword(body, getClientIp(request));

      const response = NextResponse.json({ message: "Password reset." }, { status: 200 });
      clearAuthCookie(response);
      return response;
    } catch (error) {
      if (error instanceof AuthError) return errorResponse(error);
      console.error("Reset password error:", error);
      return NextResponse.json(
        { message: "Unable to reset the password right now. Please try again later." },
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



