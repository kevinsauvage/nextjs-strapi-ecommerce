import { useRouter } from 'next/router';
import styles from './Cart.module.scss';
import Page from '../../components/Page/Page';
import { messages } from '../../config/i18n';

function CartPage() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  return (
    <Page title="Cart">
      <div className={styles.cart} />
    </Page>
  );
}

export default CartPage;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
