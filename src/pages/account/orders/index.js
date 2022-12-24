// import { useState } from 'react';
import Orders from '@/components/scopes/account/Orders/Orders';
import nookies from 'nookies';
import { getUserOrders } from '@/lib/shopify/customer/customerApiCall';
import Page from '@/layout/Page/Page';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';

export default function OrdersPage({ orders }) {
  return (
    <Page title="Orders">
      <AccountLayout
        title="Orders"
        subtitle="Welcome to your order history! Here you can find a complete list of all your orders with us, along with details such as the date of purchase, the items included, and the delivery status. This is a useful resource for keeping track of your purchases and ensuring that your orders are being processed and delivered efficiently."
      >
        <div className="orders">
          <Orders orders={orders} />
        </div>
      </AccountLayout>
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
