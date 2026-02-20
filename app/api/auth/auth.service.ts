import { hashPassword, signAuthToken, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Nullable<T> = T | null | undefined;

type SignupRequest = {
  fullName?: Nullable<string>;
  email?: Nullable<string>;
  password?: Nullable<string>;
  phoneNumber?: Nullable<string>;
};

type LoginRequest = {
  email?: Nullable<string>;
  password?: Nullable<string>;
};

type UserWithPassword = {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  countryCode: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string;
};

type PublicUser = Omit<UserWithPassword, "passwordHash">;

export type AuthSuccess = {
  user: PublicUser;
  token: string;
};

export class AuthError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "AuthError";
  }
}

export class AuthService {
  constructor(private readonly client = prisma) {}

  async signup(request: SignupRequest): Promise<AuthSuccess> {
    const fullName = this.normalizeString(request.fullName);
    const email = this.normalizeEmail(request.email);
    const password = this.normalizeString(request.password);
    const { phoneNumber, countryCode } = this.derivePhoneParts(request.phoneNumber);

    if (!fullName || !email || !password) {
      throw new AuthError("Full name, email, and password are required.", 400);
    }

    if (!email.includes("@")) {
      throw new AuthError("Please provide a valid email address.", 400);
    }

    if (password.length < 8) {
      throw new AuthError("Password must be at least 8 characters long.", 400);
    }

    const existingUser = await this.findUserByEmail(email);
    if (existingUser) {
      throw new AuthError("An account with this email already exists.", 409);
    }

    const passwordHash = await hashPassword(password);
    const user = await this.createUserWithCart({
      email,
      passwordHash,
      fullName,
      phoneNumber,
      countryCode,
    });
    const token = signAuthToken({ userId: user.id });

    return { user, token };
  }

  async login(request: LoginRequest): Promise<AuthSuccess> {
    const email = this.normalizeEmail(request.email);
    const password = this.normalizeString(request.password);

    if (!email || !password) {
      throw new AuthError("Email and password are required.", 400);
    }

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new AuthError("Invalid email or password.", 401);
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new AuthError("Invalid email or password.", 401);
    }

    const token = signAuthToken({ userId: user.id });
    const { passwordHash: _passwordHash, ...publicUser } = user;

    return { user: publicUser, token };
  }

  private normalizeString(value?: Nullable<string>) {
    return typeof value === "string" ? value.trim() : "";
  }

  private normalizeEmail(value?: Nullable<string>) {
    return this.normalizeString(value).toLowerCase();
  }

  private derivePhoneParts(input?: Nullable<string>) {
    const trimmed = this.normalizeString(input);
    if (!trimmed) {
      return { phoneNumber: null as string | null, countryCode: null as string | null };
    }

    if (trimmed.startsWith("+")) {
      const match = trimmed.match(/^(\+\d{1,4})\s*(.*)$/);
      if (match) {
        const [, code, rest] = match;
        return {
          phoneNumber: rest.replace(/\s+/g, "") || null,
          countryCode: code,
        };
      }
    }

    return {
      phoneNumber: trimmed,
      countryCode: null,
    };
  }

  private async findUserByEmail(email: string): Promise<UserWithPassword | null> {
    return this.client.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        countryCode: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: true,
      },
    });
  }

  private async createUserWithCart(payload: {
    email: string;
    passwordHash: string;
    fullName: string;
    phoneNumber: string | null;
    countryCode: string | null;
  }): Promise<PublicUser> {
    const result = await this.client.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: payload,
        select: {
          id: true,
          email: true,
          fullName: true,
          phoneNumber: true,
          countryCode: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      await tx.cart.create({
        data: {
          user_id: createdUser.id,
          services: {
            connect: [],
          },
        },
      });

      return createdUser;
    });

    return result;
  }

  async findUserById(id: string) {
    return this.client.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        countryCode: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
