import { useRouter } from 'next/router';
import nookies from 'nookies';
import { getOrderById } from '@/lib/shopify/customer/customerApiCall';
import ProductCheckoutCard from '@/components/scopes/product/ProductCheckoutCard/ProductCheckoutCard';

function OrderDetail({ order }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;

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
  } = order;

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
  } = shippingAddress;

  return (
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
        Total Shipping Price: {totalShippingPrice.amount}{' '}
        {totalShippingPrice.currencyCode}
      </p>
      <p>
        Total Price: {totalPrice.amount} {totalPrice.currencyCode}
      </p>
      {canceledAt ? (
        <>
          <p>
            Total Refunded: {totalRefunded.amount} {totalRefunded.currencyCode}
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
      {lineItems.map((item) => (
        <ProductCheckoutCard key={item.id} lineItem={item} />
      ))}
    </div>
  );
}

export default OrderDetail;

export const getServerSideProps = async (ctx) => {
  const { req, query } = ctx;
  const cookies = nookies.get(ctx);
  const delegateToken = cookies?.shopifyDelegateToken;

  const forwarded = req.headers['x-forwarded-for'];

  const ip =
    typeof forwarded === 'string'
      ? forwarded.split(/, /)[0]
      : req.socket.remoteAddress;

  const orderId = `gid://shopify/Order/${query.orderId}?key=${query.key}`;

  const response = await getOrderById(orderId, delegateToken, ip);

  return {
    props: {
      order: response || null,
    },
  };
};
