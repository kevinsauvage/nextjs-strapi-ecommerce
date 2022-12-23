// import { useState } from 'react';
import Orders from '@/components/scopes/account/Orders/Orders';
import nookies from 'nookies';
import { getUserOrders } from '@/lib/shopify/customer/customerApiCall';
import Page from '@/layout/Page/Page';

export default function OrdersPage({ orders }) {
  return (
    <Page title="Orders">
      <div className="orders">
        <Orders orders={orders} />
      </div>
    </Page>
  );
}

export const getServerSideProps = async (ctx) => {
  const { req } = ctx;
  const cookies = nookies.get(ctx);
  const delegateToken = cookies?.shopifyDelegateToken;
  const shopifyToken = cookies?.shopifyToken
    ? JSON.parse(cookies?.shopifyToken)?.token
    : null;

  const forwarded = req.headers['x-forwarded-for'];

  const ip =
    typeof forwarded === 'string'
      ? forwarded.split(/, /)[0]
      : req.socket.remoteAddress;

  const response = await getUserOrders(shopifyToken, delegateToken, ip);

  const customer = response?.customer || null;
  return {
    props: {
      orders: customer?.orders || null,
    },
  };
};
