/* eslint-disable unicorn/consistent-destructuring */
'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DEFAULTS } from '@/config/constants';
import type {
  OrderFieldsFragment,
  OrderFinancialStatus,
  OrderFulfillmentStatus,
} from '@/shopify/storefront';

function formatStatus(status?: OrderFulfillmentStatus | OrderFinancialStatus | null) {
  return status
    ? status
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (match) => match.toUpperCase())
    : DEFAULTS.na;
}

const getDate = (timestamp: string | number | Date | undefined | null = new Date()) => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    year: 'numeric',
  };
  const date = new Date(timestamp ?? new Date());
  return date.toLocaleDateString('en-US', options);
};

const Row = ({ label, value }: { label: string; value: string | number | null }) => (
  <div className="flex justify-between gap-4 py-1 border-b border-border last:border-none">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

const OrderCard = ({ order }: { order: OrderFieldsFragment }) => {
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

  return (
    <li className="list-none">
      <Collapsible open={open} onOpenChange={setOpen}>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between p-4 cursor-pointer">
            <CollapsibleTrigger asChild>
              <button className="flex items-center justify-between gap-2 w-full">
                <h5 className="text-lg font-semibold">Order {order.name}</h5>
                {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </CollapsibleTrigger>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="space-y-8">
              <div className="space-y-1">
                <h6 className="font-medium text-base">Order Details</h6>

                <Row
                  label="Subtotal"
                  value={`${subtotalPrice?.amount} ${subtotalPrice?.currencyCode}`}
                />
                <Row label="Total" value={`${totalPrice?.amount} ${totalPrice?.currencyCode}`} />

                {totalRefunded?.amount && Number(totalRefunded.amount) > 0 && (
                  <Row
                    label="Refunded"
                    value={`${totalRefunded.amount} ${totalRefunded.currencyCode}`}
                  />
                )}

                <Row label="Financial Status" value={formatStatus(financialStatus)} />
                <Row label="Fulfillment Status" value={formatStatus(fulfillmentStatus)} />
                <Row label="Email" value={email || DEFAULTS.na} />
                {phone && <Row label="Phone" value={phone} />}
                {typeof order?.processedAt === 'string' && (
                  <Row label="Processed At" value={getDate(order.processedAt)} />
                )}

                {shippingAddress?.name && (
                  <Row label="Shipping To" value={shippingAddress.formatted.join(', ')} />
                )}

                {typeof order?.canceledAt === 'string' && typeof cancelReason === 'string' && (
                  <>
                    <Row label="Cancel Reason" value={cancelReason} />
                    <Row label="Canceled At" value={getDate(order.canceledAt)} />
                  </>
                )}
              </div>

              {successfulFulfillments && successfulFulfillments.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h6 className="font-medium text-base">Tracking Information</h6>

                  {successfulFulfillments.map((fulfillment, index) => {
                    const { trackingInfo, trackingCompany } = fulfillment;

                    if (!trackingInfo || trackingInfo.length === 0) return null;

                    return (
                      <div key={uuidv4()} className="space-y-2">
                        <div className={`flex justify-between py-1 border-b border-border `}>
                          <span className="text-sm text-muted-foreground">
                            {trackingCompany || DEFAULTS.carrier}
                            {successfulFulfillments.length > 1 ? ` (${index + 1})` : ''}
                          </span>
                          <span className="text-sm font-medium">{trackingInfo.length} items</span>
                        </div>

                        {trackingInfo.map((trackInfo) => (
                          <div
                            key={uuidv4()}
                            className="flex justify-between py-1 border-b border-border"
                          >
                            <span className="text-sm text-muted-foreground">
                              {trackInfo.number || DEFAULTS.trackingNumber}
                            </span>
                            {typeof trackInfo.url === 'string' ? (
                              <Link
                                href={trackInfo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-blue-600 hover:underline"
                              >
                                Track
                              </Link>
                            ) : (
                              <span className="text-sm font-medium text-gray-400">
                                {DEFAULTS.link}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </li>
  );
};

export default OrderCard;
