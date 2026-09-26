import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import BackButton from '@/app/[locale]/account/_components/BackButton';
import {
  formatStatus,
  getStatusBadgeVariant,
} from '@/app/[locale]/account/_components/orderDisplay';
import TrackingInfo from '@/app/[locale]/account/_components/TrackingInfo';
import CardHeaderPattern from '@/components/CardHeaderPattern';
import Link from '@/components/LocalizedLink';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import config from '@/config';
import { DEFAULTS } from '@/config/constants';
import { getSeo } from '@/data/seo';
import type { Locale } from '@/i18n/routing';
import { getTranslations, localeFromParams, redirectToPath } from '@/i18n/server';
import { getOrderById } from '@/lib/server/account';
import { getShopifyToken } from '@/lib/server/shopify-helpers';
import type { OrderFieldsFragment } from '@/shopify/storefront';
import { formatDate, formatPrice } from '@/utils/format';

import OrderDetailActions from './_components/OrderDetailActions';

type OrderDetailParams = {
  locale: string;
  orderId: string;
};

const getOrder = async (orderId: string, locale: Locale): Promise<OrderFieldsFragment | null> => {
  const token = await getShopifyToken();

  if (!token) {
    redirectToPath(config.routes.login, locale);
  }

  return getOrderById(token, orderId);
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<OrderDetailParams>;
}): Promise<Metadata> => {
  const { orderId } = await params;
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'account');
  const order = await getOrder(orderId, locale);

  if (!order) return {};

  return {
    description: getSeo(locale).account.orders.description,
    title: t('orderTitle', { name: order.name }),
    robots: { index: false, follow: false },
  };
};

const DetailRow = ({ label, value }: { label: string; value: string | number | null }) => (
  <div className="flex items-baseline justify-between gap-4 border-b border-border/70 py-2">
    <dt className="whitespace-nowrap text-body-sm text-secondary">{label}</dt>
    <dd className="text-right text-body-sm font-medium">{value}</dd>
  </div>
);

const OrderDetailPage = async ({ params }: { params: Promise<OrderDetailParams> }) => {
  const { orderId } = await params;
  const locale = await localeFromParams(params);
  const t = getTranslations(locale, 'account');
  const statusLabels = t.raw('orderStatus') as Record<string, string>;
  const order = await getOrder(orderId, locale);

  if (!order) {
    notFound();
  }

  const lineItems = order.lineItems.edges.map((edge) => edge.node);
  const itemsCount = lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemsWord = itemsCount === 1 ? t('item') : t('items');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeaderPattern
          as="h2"
          title={t('orderTitle', { name: order.name })}
          size={3}
          actions={<OrderDetailActions orderId={orderId} orderName={order.name} />}
          description={
            typeof order.processedAt === 'string'
              ? `${t('placedOn')} ${formatDate(order.processedAt, locale)} · ${itemsCount} ${itemsWord}`
              : `${itemsCount} ${itemsWord}`
          }
        />
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {order.fulfillmentStatus && (
              <Badge variant={getStatusBadgeVariant(order.fulfillmentStatus)}>
                {formatStatus(order.fulfillmentStatus, statusLabels)}
              </Badge>
            )}
            {order.financialStatus && (
              <Badge variant={getStatusBadgeVariant(order.financialStatus)}>
                {formatStatus(order.financialStatus, statusLabels)}
              </Badge>
            )}
            {typeof order.customerUrl === 'string' && (
              <a
                href={order.customerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-sm font-medium link"
              >
                {t('liveTracking')}
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-heading-4 mb-3">{t('items')}</h3>
          <div className="divide-y divide-border/70">
            {lineItems.map((item, index) => {
              const productHandle = item.variant?.product?.handle;

              return (
                <div
                  key={`${item.variant?.id ?? item.title}-${index + 1}`}
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
                        <p className="text-caption-sm text-secondary">{item.variant.title}</p>
                      )}
                      <p className="text-secondary">
                        {t('qty')} {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-body font-medium tabular-nums">
                    {formatPrice(
                      item.discountedTotalPrice.amount,
                      item.discountedTotalPrice.currencyCode,
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-heading-4 mb-3">{t('summary')}</h3>
          <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {order.subtotalPrice && (
              <DetailRow
                label={t('subtotal')}
                value={formatPrice(order.subtotalPrice.amount, order.subtotalPrice.currencyCode)}
              />
            )}
            <DetailRow
              label={t('shipping')}
              value={formatPrice(
                order.totalShippingPrice.amount,
                order.totalShippingPrice.currencyCode,
              )}
            />
            {order.totalTaxV2 && (
              <DetailRow
                label={t('taxes')}
                value={formatPrice(order.totalTaxV2.amount, order.totalTaxV2.currencyCode)}
              />
            )}
            <DetailRow
              label={t('total')}
              value={formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
            />
            {order.totalRefunded?.amount && Number(order.totalRefunded.amount) > 0 && (
              <DetailRow
                label={t('refunded')}
                value={formatPrice(order.totalRefunded.amount, order.totalRefunded.currencyCode)}
              />
            )}
            <DetailRow
              label={t('financialStatus')}
              value={formatStatus(order.financialStatus, statusLabels)}
            />
            <DetailRow
              label={t('fulfillmentStatus')}
              value={formatStatus(order.fulfillmentStatus, statusLabels)}
            />
            <DetailRow label={t('email')} value={order.email || DEFAULTS.na} />
            {order.phone && <DetailRow label={t('phone')} value={order.phone} />}
            {order.shippingAddress?.name && (
              <DetailRow
                label={t('shippingTo')}
                value={order.shippingAddress.formatted.join(', ')}
              />
            )}
            {typeof order.canceledAt === 'string' && typeof order.cancelReason === 'string' && (
              <>
                <DetailRow
                  label={t('cancelReason')}
                  value={formatStatus(order.cancelReason, statusLabels)}
                />
                <DetailRow label={t('canceledAt')} value={formatDate(order.canceledAt)} />
              </>
            )}
          </dl>

          {order.customAttributes.length > 0 && (
            <div className="mt-4">
              <h4 className="text-heading-4 mb-3">{t('orderNotes')}</h4>
              <dl className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {order.customAttributes.map((attribute) => (
                  <DetailRow
                    key={attribute.key}
                    label={attribute.key}
                    value={attribute.value ?? DEFAULTS.na}
                  />
                ))}
              </dl>
            </div>
          )}

          <div className="mt-4">
            <TrackingInfo fulfillments={order.successfulFulfillments} />
          </div>
        </CardContent>
      </Card>

      <BackButton locale={locale} />
    </div>
  );
};

export default OrderDetailPage;
