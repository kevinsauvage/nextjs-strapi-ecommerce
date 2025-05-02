import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type {
  OrderFieldsFragment,
  OrderFinancialStatus,
  OrderFulfillmentStatus,
} from '@/shopify/storefront';

import SuccessfulFulfillments from './OrderCard/SuccessfulFulfillments';

function formatStatus(status: OrderFulfillmentStatus | OrderFinancialStatus) {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
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

const OrderCard = ({ order }: { order: OrderFieldsFragment }) => {
  const {
    financialStatus,
    email,
    cancelReason,
    phone,
    fulfillmentStatus,
    totalRefunded,
    totalPrice,

    successfulFulfillments,
  } = order || {};

  return (
    <li className="list-none">
      <Card className="w-full mb-4">
        <CardHeader className="pb-2">
          <h5 className="text-lg font-semibold">Order {order.name}</h5>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h6 className="font-medium text-base">Order information</h6>

            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-sm text-gray-500">Total price</span>
              <span className="text-sm font-medium">{`${totalRefunded?.amount} ${totalPrice?.currencyCode}`}</span>
            </div>

            {typeof totalRefunded?.amount === 'string' &&
              Number.parseInt(totalRefunded?.amount || '0', 10) > 0 && (
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Total refunded</span>
                  <span className="text-sm font-medium">{`${totalRefunded?.amount} ${totalRefunded?.currencyCode}`}</span>
                </div>
              )}

            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-sm text-gray-500">Financial Status</span>
              <span className="text-sm font-medium">{formatStatus(financialStatus)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-sm text-gray-500">Fulfillment Status</span>
              <span className="text-sm font-medium">{formatStatus(fulfillmentStatus)}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium">{email}</span>
            </div>

            {phone && (
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-sm text-gray-500">Phone</span>
                <span className="text-sm font-medium">{phone}</span>
              </div>
            )}

            {typeof order.processedAt === 'string' && (
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-sm text-gray-500">Processed At</span>
                <span className="text-sm font-medium">{getDate(order.processedAt)}</span>
              </div>
            )}

            {typeof order.canceledAt === 'string' && typeof cancelReason === 'string' && (
              <>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Cancel Reason</span>
                  <span className="text-sm font-medium">{cancelReason}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Canceled At</span>
                  <span className="text-sm font-medium">{getDate(order.canceledAt)}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>

        {successfulFulfillments && successfulFulfillments.length > 0 && (
          <CardFooter className="flex-col items-start">
            <SuccessfulFulfillments successfulFulfillments={successfulFulfillments} />
          </CardFooter>
        )}
      </Card>
    </li>
  );
};

export default OrderCard;
