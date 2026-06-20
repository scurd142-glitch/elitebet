import { Decimal } from "@prisma/client/runtime/library";

export function toNumber(value: Decimal | number | string): number {
  if (value instanceof Decimal) return value.toNumber();
  return Number(value);
}

export function decimal(value: number | string): Decimal {
  return new Decimal(value);
}
