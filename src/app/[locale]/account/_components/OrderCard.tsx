'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Link from '@/components/LocalizedLink';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import config from '@/config';
import { DEFAULTS } from '@/config/constants';
import type { OrderFieldsFragment } from '@/shopify/storefront';
import { cn } from '@/utils/cn';
import { formatDate, formatPrice } from '@/utils/format';
import { getNumericOrderId } from '@/utils/order';

import { formatStatus, getStatusBadgeVariant } from './orderDisplay';
import TrackingInfo from './TrackingInfo';

import { ChevronDown, Package } from 'lucide-react';

const Detail = ({ label, value }: { label: string; value: string | number | null }) => (
  <div className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2">
    <dt className="whitespace-nowrap text-body-sm text-secondary">{label}</dt>
    <dd className="text-right text-body-sm font-medium">{value}</dd>
  </div>
);

const OrderCard = ({ order }: { order: OrderFieldsFragment }) => {
  const t = useTranslations('account');
  const {
    financialStatus,
    email,
    cancelReason,
    phone,
    fulfillmentStatus,
    totalRefunded,
    totalPrice,
    subtotalPrice,
    successfulFulfillments,
    shippingAddress,
  } = order;

  const [open, setOpen] = useState(false);

  // Get order items from fulfillments
  const orderItems =
    successfulFulfillments
      ?.flatMap((fulfillment) =>
        fulfillment.fulfillmentLineItems?.edges?.map((edge) => edge.node.lineItem),
      )
      .filter(Boolean) || [];

  const itemsCount = orderItems.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  const numericId = getNumericOrderId(order.id);

  const details: Array<{ label: string; value: string | number | null }> = [];

  if (subtotalPrice) {
    details.push({
      label: t('subtotal'),
      value: formatPrice(subtotalPrice.amount, subtotalPrice.currencyCode),
    });
  }
  if (totalPrice) {
    details.push({
      label: t('total'),
      value: formatPrice(totalPrice.amount, totalPrice.currencyCode),
    });
  }
  if (totalRefunded?.amount && Number(totalRefunded.amount) > 0) {
    details.push({
      label: t('refunded'),
      value: formatPrice(totalRefunded.amount, totalRefunded.currencyCode),
    });
  }

  details.push(
    { label: t('financialStatus'), value: formatStatus(financialStatus) },
    { label: t('fulfillmentStatus'), value: formatStatus(fulfillmentStatus) },
    { label: t('email'), value: email || DEFAULTS.na },
  );

  if (phone) {
    details.push({ label: t('phone'), value: phone });
  }
  if (typeof order.processedAt === 'string') {
    details.push({ label: t('processedAt'), value: formatDate(order.processedAt) });
  }
  if (shippingAddress?.name) {
    details.push({ label: t('shippingTo'), value: shippingAddress.formatted.join(', ') });
  }
  if (typeof order.canceledAt === 'string' && typeof cancelReason === 'string') {
    details.push(
      { label: t('cancelReason'), value: cancelReason },
      { label: t('canceledAt'), value: formatDate(order.canceledAt) },
    );
  }

  return (
    <li className="list-none">
      <Collapsible open={open} onOpenChange={setOpen}>
        <Card className="w-full py-0 transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 md:p-6">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-heading-4">{t('orderTitle', { name: order.name })}</h3>
                {fulfillmentStatus && (
                  <Badge variant={getStatusBadgeVariant(fulfillmentStatus)}>
                    {formatStatus(fulfillmentStatus)}
                  </Badge>
                )}
                {financialStatus && (
                  <Badge variant={getStatusBadgeVariant(financialStatus)}>
                    {formatStatus(financialStatus)}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body-sm text-secondary">
                {typeof order.processedAt === 'string' && (
                  <span>{formatDate(order.processedAt)}</span>
                )}
                {totalPrice && (
                  <span className="font-medium text-foreground tabular-nums">
                    {formatPrice(totalPrice.amount, totalPrice.currencyCode)}
                  </span>
                )}
                {itemsCount > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Package size={14} aria-hidden="true" />
                    {itemsCount} {itemsCount === 1 ? t('item') : t('items')}
                  </span>
                )}
              </div>
            </div>
            {/* The heading sits outside the trigger (headings are not valid
                button content); only the chevron toggles, with its own label. */}
            <div className="flex shrink-0 items-center gap-2">
              {numericId && (
                <Button variant="outline" size="sm" asChild>
                  <Link href={`${config.routes.orders}/${numericId}`}>{t('viewDetails')}</Link>
                </Button>
              )}
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-label={
                    open
                      ? t('collapseOrder', { name: order.name })
                      : t('expandOrder', { name: order.name })
                  }
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border/70 text-secondary transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <ChevronDown
                    aria-hidden="true"
                    className={cn('size-5 transition-transform duration-200', open && 'rotate-180')}
                  />
                </button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="space-y-6 px-4 pb-5 md:px-6 md:pb-6">
              {orderItems.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-heading-4">{t('orderItems')}</h4>
                  <div className="divide-y divide-border/70">
                    {orderItems.slice(0, 3).map((item, index) => {
                      if (!item) return null;
                      const product = item.variant?.product;
                      const productHandle = product?.handle;

                      return (
                        <div
                          key={`order-item-${index + 1}`}
                          className="flex items-center justify-between gap-4 py-3 text-body-sm first:pt-0 last:pb-0"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            {item.variant?.image && (
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                                <Image
                                  src={item.variant.image.small || item.variant.image.url}
                                  alt={item.variant.image.altText || item.title}
                                  width={56}
                                  height={56}
                                  sizes="56px"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              {productHandle ? (
                                <Link
                                  href={`${config.routes.collection}/products/${productHandle}`}
                                  className="line-clamp-1 font-medium hover:underline"
                                >
                                  {item.title}
                                </Link>
                              ) : (
                                <p className="line-clamp-1 font-medium">{item.title}</p>
                              )}
                              {item.variant?.title && item.variant.title !== 'Default Title' && (
                                <p className="text-caption-sm text-secondary">
                                  {item.variant.title}
                                </p>
                              )}
                              <p className="text-secondary">
                                {t('qty')} {item.quantity}
                              </p>
                            </div>
                          </div>
                          {item.discountedTotalPrice && (
                            <div className="shrink-0 text-body font-medium tabular-nums">
                              {formatPrice(
                                item.discountedTotalPrice.amount,
                                item.discountedTotalPrice.currencyCode,
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {orderItems.length > 3 && (
                    <p className="text-body-sm text-secondary">
                      {t('moreItems', { rest: orderItems.length - 3 })}{' '}
                      {orderItems.length - 3 === 1 ? t('item') : t('items')}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <h4 className="text-heading-4">{t('orderDetails')}</h4>
                <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                  {details.map((detail) => (
                    <Detail key={detail.label} label={detail.label} value={detail.value} />
                  ))}
                </dl>
              </div>

              {successfulFulfillments && successfulFulfillments.length > 0 && (
                <TrackingInfo fulfillments={successfulFulfillments} />
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </li>
  );
};

export default OrderCard;
