import LineItemCard from '@/components/scopes/account/LineItemCard/LineItemCard';
import Page from '@/layout/Page/Page';
import AccountLayout from '@/layout/AccountLayout/AccountLayout';
import nextApiCall from '@/utils/apiNext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import config from '@/config/index';
import styles from './OrderPage.module.scss';

function OrderDetail() {
  const { query, push } = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const { orderId } = query;
  const id = `${orderId}?key=${query.key}`;

  useEffect(() => {
    async function fetchOrder() {
      try {
        if (orderId && query) {
          const res = await nextApiCall.getOrderById(id);
          if (res) setOrder(res);
          else toast.error('Something went wrong');
        }
      } catch (error) {
        toast.error('Something went wrong');
        push(config.routes.addresses);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [id, orderId, push, query]);

  const {
    name,
    fulfillmentStatus,
    email,
    financialStatus,
    orderNumber,
    phone,
    processedAt,
    totalRefunded,
    totalShippingPrice,
    totalPrice,
    cancelReason,
    canceledAt,
    shippingAddress,
    lineItems,
  } = order || {};

  const {
    address1,
    address2,
    city,
    company,
    country,
    countryCodeV2,
    firstName,
    lastName,
    name: fullName,
    phone: shippingPhone,
    province,
    provinceCode,
    zip,
  } = shippingAddress || {};

  return (
    <Page title={`Order: ${name}`} loading={isLoading}>
      <AccountLayout
        title={`Order: ${name}`}
        subtitle='"View detailed information about a specific order, including items, delivery address, and status, on the order details page. Track the progress of your order and update your delivery address if necessary. Thank you for your business and we hope you have a great experience with us."'
      >
        <div>
          <h1>Order Detail</h1>
          <p>Name: {name}</p>
          <p>Fulfillment Status: {fulfillmentStatus}</p>
          <p>Email: {email}</p>
          <p>Financial Status: {financialStatus}</p>
          <p>Order Number: {orderNumber}</p>
          <p>Phone: {phone}</p>
          <p>Processed At: {processedAt}</p>
          <p>
            Total Shipping Price: {totalShippingPrice?.amount}{' '}
            {totalShippingPrice?.currencyCode}
          </p>
          <p>
            Total Price: {totalPrice?.amount} {totalPrice?.currencyCode}
          </p>
          {canceledAt ? (
            <>
              <p>
                Total Refunded: {totalRefunded.amount}{' '}
                {totalRefunded.currencyCode}
              </p>
              <p>Cancel Reason: {cancelReason}</p>
              <p>Canceled At: {canceledAt}</p>
            </>
          ) : null}
          <h2>Shipping Address</h2>
          <p>Address 1: {address1}</p>
          <p>Address 2: {address2}</p>
          <p>City: {city}</p>
          {company ? <p>Company: {company}</p> : null}
          <p>Country: {country}</p>
          <p>Country Code: {countryCodeV2}</p>
          <p>First Name: {firstName}</p>
          <p>Last Name: {lastName}</p>
          <p>Full Name: {fullName}</p>
          <p>Phone: {shippingPhone}</p>
          <p>Province: {province}</p>
          <p>Province Code: {provinceCode}</p>
          <p>Zip: {zip}</p>
          <h2>Line Items</h2>
          <div className={styles.lineItems}>
            {lineItems &&
              lineItems.map((item) => (
                <LineItemCard key={item.id} item={item} />
              ))}
          </div>
        </div>
      </AccountLayout>
    </Page>
  );
}

export default OrderDetail;
