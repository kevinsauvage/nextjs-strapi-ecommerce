import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

import HeightAnimation from '@/components/HeightAnimation/HeightAnimation';
import type { GetCustomerOrdersQuery } from '@/shopify/storefront';

const SuccessfulFulfillments = ({
  successfulFulfillments,
}: {
  successfulFulfillments: GetCustomerOrdersQuery['customer']['orders']['edges'][number]['node']['successfulFulfillments'][number][];
}) => (
  <div>
    <HeightAnimation
      animationType="button"
      buttonTextActive="Hide tracking information"
      buttonTextInactive="Show tracking information"
    >
      {successfulFulfillments.map((successfulFulfillment, index) => {
        const { trackingInfo, trackingCompany } = successfulFulfillment;

        if (!trackingInfo || trackingInfo.length === 0) {
          return <></>;
        }

        return (
          <div key={uuidv4()} className="mt-2">
            <h6>Tracking information {successfulFulfillments.length > 1 && index + 1}</h6>

            <div className="flex justify-between py-1 border-b border-gray-100">
              <span className="text-sm text-gray-500">{trackingCompany}</span>
              <span className="text-sm font-medium">{trackingInfo.length} items</span>
            </div>
            {trackingInfo?.map((trackInfo) => {
              if (typeof trackInfo.url === 'string' && trackInfo.url.length > 0) {
                return (
                  <div
                    key={uuidv4()}
                    className="flex justify-between py-1 border-b border-gray-100"
                  >
                    <span className="text-sm text-gray-500">{trackInfo.number}</span>
                    <Link
                      href={trackInfo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Track
                    </Link>
                  </div>
                );
              }

              return <></>;
            })}
          </div>
        );
      })}
    </HeightAnimation>
  </div>
);

export default SuccessfulFulfillments;
