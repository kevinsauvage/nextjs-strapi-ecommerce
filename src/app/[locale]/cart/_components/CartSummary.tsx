'use client';

import { useTranslations } from 'next-intl';

import CardHeaderPattern from '@/components/CardHeaderPattern';
import CheckoutButton from '@/components/CheckoutButton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import useCartContext from '@/contexts/CartContext/useCartContext';
import { formatPrice } from '@/utils/format';

const amountOf = (money: { amount: string } | null | undefined) =>
  Number.parseFloat(money?.amount ?? '0') || 0;

const CartSummary = () => {
  const t = useTranslations('cart');
  const common = useTranslations('common');
  const { cart } = useCartContext();

  if (!cart) return null;

  // Shopify's `totalAmount` is authoritative and already includes shipping,
  // taxes, discounts and duties once they are known. We break it back out into
  // lines so the arithmetic on screen always reconciles.
  const subtotal = amountOf(cart.cost.subtotalAmount);
  const total = amountOf(cart.cost.totalAmount);
  const taxes = amountOf(cart.cost.totalTaxAmount);
  const duties = amountOf(cart.cost.totalDutyAmount);
  const discount = cart.lines.edges.reduce(
    (sum, edge) =>
      sum +
      edge.node.discountAllocations.reduce(
        (lineSum, allocation) => lineSum + amountOf(allocation.discountedAmount),
        0,
      ),
    0,
  );

  // Shipping is only known after the shopper estimates a delivery address and a
  // delivery option is selected for every group.
  const groups = cart.deliveryGroups.edges.map((edge) => edge.node);
  const selectedOptions = groups
    .map((group) => group.selectedDeliveryOption)
    .filter((option): option is NonNullable<typeof option> => Boolean(option));
  const shipping = selectedOptions.reduce((sum, option) => sum + amountOf(option.estimatedCost), 0);
  const hasShipping = selectedOptions.length > 0;
  const address = cart.delivery.addresses.find((entry) => entry.selected)?.address ?? null;

  const hasDiscount = discount > 0;
  const hasTaxes = taxes > 0;
  const hasDuties = duties > 0;
  const { currencyCode } = cart.cost.subtotalAmount;

  const footnote = hasTaxes
    ? t('estimatedForAddress')
    : hasShipping
      ? t('taxesAtCheckout')
      : t('shippingAtCheckout');

  return (
    <Card className="lg:sticky lg:top-4">
      <CardHeaderPattern className="pb-4" title={t('orderSummary')} size={4} />
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-body-sm">
            <span className="text-secondary">{t('subtotal')}</span>
            <span className="text-body font-medium tabular-nums">
              {formatPrice(subtotal, currencyCode)}
            </span>
          </div>
          {hasDiscount && (
            <div className="flex justify-between items-center text-body-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-secondary">{t('discount')}</span>
              <span className="text-body font-medium text-green-600 dark:text-green-400 tabular-nums">
                -{formatPrice(discount, currencyCode)}
              </span>
            </div>
          )}
          {hasShipping && (
            <div className="flex justify-between items-center text-body-sm">
              <span className="text-secondary">
                {t('shipping')}
                {address?.zip ? ` · ${address.zip}` : ''}
              </span>
              <span className="text-body font-medium tabular-nums">
                {shipping > 0 ? formatPrice(shipping, currencyCode) : common('free')}
              </span>
            </div>
          )}
          {hasDuties && (
            <div className="flex justify-between items-center text-body-sm">
              <span className="text-secondary">{t('duties')}</span>
              <span className="text-body font-medium tabular-nums">
                {formatPrice(duties, currencyCode)}
              </span>
            </div>
          )}
          {hasTaxes && (
            <div className="flex justify-between items-center text-body-sm">
              <span className="text-secondary">{t('taxes')}</span>
              <span className="text-body font-medium tabular-nums">
                {formatPrice(taxes, currencyCode)}
              </span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex justify-between items-baseline pt-2">
          <span className="text-body-lg font-semibold">{t('total')}</span>
          <span className="text-heading-3 text-primary tabular-nums">
            {formatPrice(total, currencyCode)}
          </span>
        </div>
        <p className="text-caption-sm text-secondary">{footnote}</p>
      </CardContent>
      <CardFooter className="pt-6">
        <CheckoutButton checkoutUrl={String(cart.checkoutUrl)} />
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
