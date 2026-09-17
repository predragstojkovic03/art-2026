import { IPriceBreakdown } from '@art-2026/shared';

export class PriceBreakdownDto implements IPriceBreakdown {
  basePricePerPerson!: number;
  earlyBirdDiscount!: number;
  bothDaysDiscount!: number;
  groupDiscount!: number;
  promoDiscount!: number;
  totalAmount!: number;
}

export interface CalculateTotalInput {
  paintingDay: boolean;
  photographyDay: boolean;
  groupSize: number;
  hasReferrer: boolean;
  pricePainting: number;
  pricePhotography: number;
  earlyBirdDeadline: Date;
  now?: Date;
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculatePriceBreakdown(input: CalculateTotalInput): PriceBreakdownDto {
  const now = input.now ?? new Date();
  const C1 = input.pricePainting;
  const C2 = input.pricePhotography;
  const isEarlyBird = now < input.earlyBirdDeadline;
  const C1eff = isEarlyBird ? C1 * 0.9 : C1;
  const C2eff = isEarlyBird ? C2 * 0.9 : C2;

  let daySubtotalPerPerson: number;
  let basePricePerPerson: number;
  let earlyBirdDiscount = 0;
  let bothDaysDiscount = 0;

  if (input.paintingDay && input.photographyDay) {
    daySubtotalPerPerson = (C1eff + C2eff) * 0.9;
    basePricePerPerson = C1 + C2;
    if (isEarlyBird) earlyBirdDiscount = round2((C1 * 0.1 + C2 * 0.1) * input.groupSize);
    bothDaysDiscount = round2((C1eff + C2eff) * 0.1 * input.groupSize);
  } else if (input.paintingDay) {
    daySubtotalPerPerson = C1eff;
    basePricePerPerson = C1;
    if (isEarlyBird) earlyBirdDiscount = round2(C1 * 0.1 * input.groupSize);
  } else if (input.photographyDay) {
    daySubtotalPerPerson = C2eff;
    basePricePerPerson = C2;
    if (isEarlyBird) earlyBirdDiscount = round2(C2 * 0.1 * input.groupSize);
  } else {
    throw new Error('At least one day must be selected');
  }

  const groupTotal = daySubtotalPerPerson * input.groupSize;
  const groupFactor =
    input.groupSize >= 5 ? 0.05 : input.groupSize === 3 ? 0.03 : 0;
  const groupDiscount = round2(groupTotal * groupFactor);
  const afterGroup = groupTotal * (1 - groupFactor);
  const promoDiscount = input.hasReferrer ? round2(afterGroup * 0.05) : 0;
  const totalAmount = round2(afterGroup * (input.hasReferrer ? 0.95 : 1));

  return {
    basePricePerPerson,
    earlyBirdDiscount,
    bothDaysDiscount,
    groupDiscount,
    promoDiscount,
    totalAmount,
  };
}
