import type { OrderFinancialStatus, OrderFulfillmentStatus } from '@/shopify/storefront';

/**
 * Localized display name for an order enum value. `labels` comes from the
 * `account.orderStatus` catalog (`t.raw('orderStatus')`); unknown values fall
 * back to title-cased English so a new Shopify status never renders blank.
 */
export function formatStatus(
  status?: OrderFinancialStatus | OrderFulfillmentStatus | string | null,
  labels?: Record<string, string>,
) {
  if (!status) return 'N/A';

  return (
    labels?.[status] ??
    status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (match) => match.toUpperCase())
  );
}

export const getStatusBadgeVariant = (
  status?: OrderFulfillmentStatus | OrderFinancialStatus | null,
): 'default' | 'secondary' | 'outline' => {
  if (!status) return 'outline';

  // Word boundaries matter: `UNFULFILLED` contains `FULFILLED` as a substring,
  // so a plain `includes` would highlight unfulfilled orders as fulfilled.
  const statusLower = status.toLowerCase();

  if (/\bfulfilled\b/.test(statusLower) || /\bpaid\b/.test(statusLower)) {
    return 'default';
  }

  if (statusLower.includes('pending') || statusLower.includes('unfulfilled')) {
    return 'secondary';
  }

  return 'outline';
};
