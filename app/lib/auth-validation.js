export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function isValidEmail(value) {
  return EMAIL_REGEX.test((value || '').trim());
}

export function isValidPassword(value) {
  return PASSWORD_REGEX.test((value || '').trim());
}

