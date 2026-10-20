export const PASSWORD_MIN_LENGTH = 8;
// bcrypt only uses the first 72 bytes, so longer passwords would be silently truncated.
export const PASSWORD_MAX_BYTES = 72;

export const PASSWORD_RULES = [
  { id: "length", label: `At least ${PASSWORD_MIN_LENGTH} characters`, test: (p: string) => p.length >= PASSWORD_MIN_LENGTH },
  { id: "letter", label: "At least one letter", test: (p: string) => /[A-Za-z]/.test(p) },
  { id: "number", label: "At least one number", test: (p: string) => /\d/.test(p) },
] as const;

/** Returns an error message, or null when the password is acceptable. */
export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (new TextEncoder().encode(password).length > PASSWORD_MAX_BYTES) {
    return "Password is too long (maximum 72 characters).";
  }
  if (!/[A-Za-z]/.test(password)) return "Password must include at least one letter.";
  if (!/\d/.test(password)) return "Password must include at least one number.";
  return null;
}
