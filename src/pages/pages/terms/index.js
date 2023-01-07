import Page from '@/layout/Page/Page';
import { getTermsOfService } from '@/lib/shopify/shop/shopApiCall';
import styles from './Terms.module.scss';

function TermsPage({ termsOfService }) {
  return (
    <Page title="Our terms and conditions">
      <div className={styles.terms}>
        <div dangerouslySetInnerHTML={{ __html: termsOfService?.body }} />
      </div>
    </Page>
  );
}

export default TermsPage;

export async function getStaticProps() {
  const shopInfo = await getTermsOfService();
  const { termsOfService } = shopInfo;

  return {
    props: {
      termsOfService,
    },
  };
}
