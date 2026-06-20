/**
 * Cross-cutting types and constants for WRITERSNITE.
 * Keep domain enums aligned with Prisma schema in backend/prisma/schema.prisma.
 */

export const BRAND = {
  name: "WRITERSNITE",
  legalEntity: "SCURDTECHS PRODUCTION LIMITED",
  country: "United States of America",
  supportEmail: "support@writersnite.com",
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
