import { discountPercentOf, formatDate, formatPrice, hasDiscountPrice } from './format';

import { describe, expect, it } from 'vitest';

describe('formatPrice', () => {
  it('formats string amounts as currency', () => {
    expect(formatPrice('12.99', 'USD')).toBe('$12.99');
  });

  it('formats numeric amounts as currency', () => {
    expect(formatPrice(10, 'USD')).toBe('$10.00');
  });

  it('falls back to zero for non-finite amounts', () => {
    expect(formatPrice('not-a-number', 'USD')).toBe('$0.00');
    expect(formatPrice(Number.NaN, 'USD')).toBe('$0.00');
    expect(formatPrice(Number.POSITIVE_INFINITY, 'USD')).toBe('$0.00');
  });

  it('falls back to plain formatting for invalid currency codes', () => {
    expect(formatPrice('5.5', 'not-a-currency')).toBe('not-a-currency 5.50');
  });
});

describe('hasDiscountPrice', () => {
  it('detects a compare-at price above the sale price', () => {
    expect(hasDiscountPrice({ amount: '80' }, { amount: '100' })).toBe(true);
    expect(hasDiscountPrice({ amount: '100' }, { amount: '100' })).toBe(false);
    expect(hasDiscountPrice({ amount: '120' }, { amount: '100' })).toBe(false);
  });

  it('returns false when either price is missing', () => {
    expect(hasDiscountPrice(null, { amount: '100' })).toBe(false);
    expect(hasDiscountPrice({ amount: '80' }, null)).toBe(false);
    expect(hasDiscountPrice()).toBe(false);
  });
});

describe('discountPercentOf', () => {
  it('returns the whole-percent discount', () => {
    expect(discountPercentOf(80, 100)).toBe('20');
    expect(discountPercentOf('75', '100')).toBe('25');
  });
});

describe('formatDate', () => {
  const date = new Date(Date.UTC(2024, 0, 5));

  it('formats with the default long format', () => {
    expect(formatDate(date)).toBe('Friday, 5 January 2024');
  });

  it('accepts custom options', () => {
    expect(formatDate(date, { month: 'short', year: 'numeric' })).toBe('Jan 2024');
  });

  it('formats in UTC regardless of the runtime timezone', () => {
    // 00:30Z is still the previous day in any negative-offset timezone, so a
    // local-time format would differ between server and client. Pinning to UTC
    // keeps the output stable (no hydration mismatch).
    expect(formatDate('2024-01-05T00:30:00.000Z')).toBe('Friday, 5 January 2024');
  });

  it('returns the fallback for missing or invalid values', () => {
    expect(formatDate(undefined)).toBe('N/A');
    expect(formatDate(null)).toBe('N/A');
    expect(formatDate('')).toBe('N/A');
    expect(formatDate('not-a-date')).toBe('N/A');
  });

  // Pinned to UTC noon so the calendar date is stable regardless of the
  // machine timezone (the implementation also pins UTC for this reason).
  const NOON_UTC = '2026-09-26T12:00:00.000Z';

  it('formats Spanish and French dates in their own locale', () => {
    expect(formatDate(NOON_UTC, 'es')).toBe('sábado, 26 de septiembre de 2026');
    expect(formatDate(NOON_UTC, 'fr')).toBe('samedi 26 septembre 2026');
  });

  it('keeps custom options while switching the locale', () => {
    expect(
      formatDate(NOON_UTC, { day: 'numeric', month: 'short', year: 'numeric' }, undefined, 'es'),
    ).toBe('26 sept 2026');
  });

  it('returns the fallback for missing values in any locale', () => {
    expect(formatDate(null, 'es')).toBe('N/A');
    expect(formatDate('garbage', undefined, '—')).toBe('—');
  });
});
