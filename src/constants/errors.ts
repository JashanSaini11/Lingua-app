// Every message the auth screens can show lives here, so the copy is easy to find and change.

export const PASSWORD_MIN_LENGTH = 8;

export const authErrors = {
  // Alert titles
  title: "Something went wrong",
  incompleteTitle: "Sign up not finished",
  signInIncompleteTitle: "Sign in not finished",

  // Checked in the app before calling Clerk
  emailRequired: "Please enter your email.",
  emailInvalid: "Please enter a valid email address.",
  passwordRequired: "Please enter a password.",
  passwordTooShort: `Your password must be at least ${PASSWORD_MIN_LENGTH} characters.`,

  // Clerk error code -> message shown to the user
  clerk: {
    form_identifier_not_found: "We couldn't find an account with this email. Sign up first.",
    form_identifier_exists: "An account with this email already exists. Try logging in.",
    form_password_length_too_short: `Your password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    form_password_pwned:
      "This password was found in a data breach. Please choose a different one.",
    form_code_incorrect: "That code is not correct. Please try again.",
    verification_expired: "That code has expired. Please go back and request a new one.",
    too_many_requests: "Too many attempts. Please wait a moment and try again.",
  } as Record<string, string>,

  // Fallbacks
  generic: "Please try again.",
  missingFields: (fields: string[]) =>
    `Your account needs more details: ${fields.join(", ") || "unknown"}.`,
  unfinishedSignIn: (status: string) =>
    `We couldn't finish signing you in (${status}).`,
} as const;
