import { IPriceBreakdown } from '@art-2026/shared';
import { formatCurrency } from '@/shared/presentation/lib/utils';

interface Config {
  pricePainting: number;
  pricePhotography: number;
  earlyBirdDeadline: string;
}

export function computePriceBreakdown(
  config: Config,
  paintingDay: boolean,
  photographyDay: boolean,
  groupSize: number,
  hasPromo: boolean,
): IPriceBreakdown {
  const now = new Date();
  const deadline = new Date(config.earlyBirdDeadline);
  const isEarlyBird = now < deadline;
  const C1 = config.pricePainting;
  const C2 = config.pricePhotography;
  const C1eff = isEarlyBird ? C1 * 0.9 : C1;
  const C2eff = isEarlyBird ? C2 * 0.9 : C2;

  const round2 = (n: number): number => Math.round(n * 100) / 100;
  let daySubtotalPerPerson = 0;
  let basePricePerPerson = 0;
  let earlyBirdDiscount = 0;
  let bothDaysDiscount = 0;

  if (paintingDay && photographyDay) {
    daySubtotalPerPerson = (C1eff + C2eff) * 0.9;
    basePricePerPerson = C1 + C2;
    if (isEarlyBird) earlyBirdDiscount = round2((C1 * 0.1 + C2 * 0.1) * groupSize);
    bothDaysDiscount = round2((C1eff + C2eff) * 0.1 * groupSize);
  } else if (paintingDay) {
    daySubtotalPerPerson = C1eff;
    basePricePerPerson = C1;
    if (isEarlyBird) earlyBirdDiscount = round2(C1 * 0.1 * groupSize);
  } else if (photographyDay) {
    daySubtotalPerPerson = C2eff;
    basePricePerPerson = C2;
    if (isEarlyBird) earlyBirdDiscount = round2(C2 * 0.1 * groupSize);
  }

  const groupTotal = daySubtotalPerPerson * groupSize;
  const groupFactor = groupSize >= 5 ? 0.05 : groupSize === 3 ? 0.03 : 0;
  const groupDiscount = round2(groupTotal * groupFactor);
  const afterGroup = groupTotal * (1 - groupFactor);
  const promoDiscount = hasPromo ? round2(afterGroup * 0.05) : 0;
  const totalAmount = round2(afterGroup * (hasPromo ? 0.95 : 1));

  return { basePricePerPerson, earlyBirdDiscount, bothDaysDiscount, groupDiscount, promoDiscount, totalAmount };
}

interface Props {
  breakdown: IPriceBreakdown;
  groupSize: number;
  compact?: boolean;
}

export function PriceSummary({ breakdown, groupSize, compact = false }: Props) {
  const totalDayPrice = breakdown.basePricePerPerson * groupSize;

  return (
    <div className={compact ? '' : 'sticky top-6'}>
      <div className="bg-gradient-to-br from-white to-[oklch(0.98_0.02_60)] rounded-xl border border-[oklch(0.88_0.03_60)] shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-r from-[oklch(0.94_0.06_40)] to-[oklch(0.90_0.10_20)] border-b border-[oklch(0.85_0.05_40)]">
          <h3 className="font-display text-lg font-semibold text-[oklch(0.20_0.10_40)]">
            Kalkulacija cene
          </h3>
        </div>

        <div className="p-5 space-y-3">
          <Row label={`Osnovna cena (${groupSize} ${personNoun(groupSize)})`} value={totalDayPrice} muted />

          {breakdown.earlyBirdDiscount > 0 && (
            <Row label="Popust — ranija prijava (10%)" value={-breakdown.earlyBirdDiscount} discount />
          )}
          {breakdown.bothDaysDiscount > 0 && (
            <Row label="Popust — oba dana (10%)" value={-breakdown.bothDaysDiscount} discount />
          )}
          {breakdown.groupDiscount > 0 && (
            <Row label="Grupni popust" value={-breakdown.groupDiscount} discount />
          )}
          {breakdown.promoDiscount > 0 && (
            <Row label="Promo kod (5%)" value={-breakdown.promoDiscount} discount />
          )}

          <div className="border-t border-[oklch(0.90_0.03_60)] pt-3 mt-3">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-[oklch(0.20_0.05_40)]">Ukupno za plaćanje</span>
              <span className="font-display text-2xl font-bold text-[oklch(0.35_0.15_40)]">
                {formatCurrency(breakdown.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted, discount }: { label: string; value: number; muted?: boolean; discount?: boolean }) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className={muted ? 'text-[oklch(0.45_0.03_40)]' : discount ? 'text-green-700' : 'text-[oklch(0.30_0.05_40)]'}>
        {label}
      </span>
      <span className={discount ? 'text-green-700 font-medium' : muted ? 'text-[oklch(0.45_0.03_40)]' : 'font-medium'}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function personNoun(n: number): string {
  if (n === 1) return 'osoba';
  if (n >= 2 && n <= 4) return 'osobe';
  return 'osoba';
}
