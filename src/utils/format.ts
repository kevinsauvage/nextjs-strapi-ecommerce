/**
 * Formats a price amount with currency code
 * @param amount - The price amount (string or number)
 * @param currencyCode - The currency code (e.g., 'USD', 'EUR')
 * @returns Formatted price string (e.g., "$12.99" or "€12.99")
 */
export const formatPrice = (amount: string | number, currencyCode: string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Use Intl.NumberFormat for proper currency formatting
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(numAmount);
  } catch {
    // Fallback if currency code is invalid
    const formatted = numAmount.toFixed(2);
    return `${currencyCode} ${formatted}`;
  }
};

