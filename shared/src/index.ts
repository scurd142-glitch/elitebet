/**
 * Cross-cutting types and constants for EliteBet.
 * Keep domain enums aligned with Prisma schema in backend/prisma/schema.prisma.
 */

export const BRAND = {
  name: "EliteBet",
  legalEntity: "EliteBet",
  country: "Kenya",
  supportEmail: "support@elitebet.co.ke",
} as const;

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResult<T> = ApiSuccess<T> | ApiError;
