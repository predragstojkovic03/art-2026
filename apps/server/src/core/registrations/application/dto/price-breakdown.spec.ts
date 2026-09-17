import { calculatePriceBreakdown } from './price-breakdown.dto';

const config = {
  pricePainting: 1000,
  pricePhotography: 2000,
  earlyBirdDeadline: new Date('2026-04-30'),
};
const AFTER = new Date('2026-05-15');
const BEFORE = new Date('2026-04-01');

describe('calculatePriceBreakdown', () => {
  it('painting only, no early bird, group 1, no promo → 1000', () => {
    const r = calculatePriceBreakdown({ paintingDay: true, photographyDay: false, groupSize: 1, hasReferrer: false, ...config, now: AFTER });
    expect(r.totalAmount).toBe(1000);
    expect(r.basePricePerPerson).toBe(1000);
    expect(r.earlyBirdDiscount).toBe(0);
  });

  it('photography only, no early bird → 2000', () => {
    const r = calculatePriceBreakdown({ paintingDay: false, photographyDay: true, groupSize: 1, hasReferrer: false, ...config, now: AFTER });
    expect(r.totalAmount).toBe(2000);
  });

  it('both days, no early bird → 2700', () => {
    const r = calculatePriceBreakdown({ paintingDay: true, photographyDay: true, groupSize: 1, hasReferrer: false, ...config, now: AFTER });
    expect(r.totalAmount).toBe(2700);
    expect(r.bothDaysDiscount).toBe(300);
  });

  it('painting only, WITH early bird → 900', () => {
    const r = calculatePriceBreakdown({ paintingDay: true, photographyDay: false, groupSize: 1, hasReferrer: false, ...config, now: BEFORE });
    expect(r.totalAmount).toBe(900);
    expect(r.earlyBirdDiscount).toBe(100);
  });

  it('both days, WITH early bird → 2430', () => {
    const r = calculatePriceBreakdown({ paintingDay: true, photographyDay: true, groupSize: 1, hasReferrer: false, ...config, now: BEFORE });
    expect(r.totalAmount).toBe(2430);
    expect(r.earlyBirdDiscount).toBe(300);
    expect(r.bothDaysDiscount).toBe(270);
  });

  it('group 3 → 3% off', () => {
    const r = calculatePriceBreakdown({ paintingDay: true, photographyDay: false, groupSize: 3, hasReferrer: false, ...config, now: AFTER });
    expect(r.totalAmount).toBe(2910);
    expect(r.groupDiscount).toBe(90);
  });

  it('group 5 → 5% off', () => {
    const r = calculatePriceBreakdown({ paintingDay: true, photographyDay: false, groupSize: 5, hasReferrer: false, ...config, now: AFTER });
    expect(r.totalAmount).toBe(4750);
    expect(r.groupDiscount).toBe(250);
  });

  it('group 4 → no group discount', () => {
    const r = calculatePriceBreakdown({ paintingDay: true, photographyDay: false, groupSize: 4, hasReferrer: false, ...config, now: AFTER });
    expect(r.totalAmount).toBe(4000);
    expect(r.groupDiscount).toBe(0);
  });

  it('painting with promo → 950', () => {
    const r = calculatePriceBreakdown({ paintingDay: true, photographyDay: false, groupSize: 1, hasReferrer: true, ...config, now: AFTER });
    expect(r.totalAmount).toBe(950);
    expect(r.promoDiscount).toBe(50);
  });

  it('all discounts combined', () => {
    const r = calculatePriceBreakdown({ paintingDay: true, photographyDay: true, groupSize: 3, hasReferrer: true, ...config, now: BEFORE });
    expect(r.totalAmount).toBeCloseTo(6717.74, 1);
    expect(r.earlyBirdDiscount).toBe(900);
  });
});
