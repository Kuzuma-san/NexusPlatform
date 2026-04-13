export interface TokenPayload {
  sub: number;          // Subject (User ID)
  email: string;
  roles: string[];
  iat?: number;         // Issued At
  exp?: number;         // Expiration
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;    // Timestamp
}