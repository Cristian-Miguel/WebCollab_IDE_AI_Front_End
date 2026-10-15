import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { AuthUser, UserTokenPayload } from '../../feature/auth/model/auth_model';

let accessToken: string | null = null;

export const saveTokens = (token: string): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

export const clearTokens = (): void => {
  accessToken = null;
};

export const decodeToken = (token: string): UserTokenPayload | null => {
  try {
    return jwtDecode<UserTokenPayload>(token);
  } catch {
    return null;
  }
};

export const decodeTokenPayload = (token: string): AuthUser | null => {
  const payload = decodeToken(token);
  if (
    !payload ||
    !payload.sub ||
    !payload.email ||
    !payload.role ||
    !payload.exp ||
    payload.exp <= Date.now() / 1000
  ) {
    return null;
  }

  return {
    uuid: payload.sub,
    sub: payload.sub,
    email: payload.email,
    profileImageUrl: payload.profileImageUrl || '',
    role: payload.role,
    exp: payload.exp,
    aud: payload.aud,
    iss: payload.iss,
    type: payload.type,
  };
};

export const validateResetToken = (token: string): 'valid' | 'expired' | 'invalid_format' => {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    if (!payload.exp) return 'invalid_format';
    return payload.exp <= Date.now() / 1000 ? 'expired' : 'valid';
  } catch {
    return 'invalid_format';
  }
};

export const validateEmailToken = validateResetToken;
