import { formatStatus, getStatusBadgeVariant } from './orderDisplay';

import { describe, expect, it } from 'vitest';

const LABELS: Record<string, string> = {
  FULFILLED: 'Enviado',
  PAID: 'Pagado',
};

describe('formatStatus', () => {
  it('returns the localized label when the catalog knows the status', () => {
    expect(formatStatus('FULFILLED', LABELS)).toBe('Enviado');
    expect(formatStatus('PAID', LABELS)).toBe('Pagado');
  });

  it('falls back to title-cased English for unknown statuses', () => {
    expect(formatStatus('PARTIALLY_REFUNDED', LABELS)).toBe('Partially Refunded');
    expect(formatStatus('FULFILLED')).toBe('Fulfilled');
  });

  it('returns N/A without a status', () => {
    expect(formatStatus(null, LABELS)).toBe('N/A');
    expect(formatStatus(undefined)).toBe('N/A');
  });
});

describe('getStatusBadgeVariant', () => {
  it('highlights fulfilled and paid states', () => {
    expect(getStatusBadgeVariant('FULFILLED')).toBe('default');
    expect(getStatusBadgeVariant('PAID')).toBe('default');
  });

  it('dims pending states and outlines the rest', () => {
    expect(getStatusBadgeVariant('PENDING')).toBe('secondary');
    expect(getStatusBadgeVariant('UNFULFILLED')).toBe('secondary');
    expect(getStatusBadgeVariant('REFUNDED')).toBe('outline');
    expect(getStatusBadgeVariant(null)).toBe('outline');
  });
});
