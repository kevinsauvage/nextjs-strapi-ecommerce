import Collapsible from '@/components/Collapsible/Collapsible';
import processHtml from '@/utils';

import styles from './ProductDetails.module.scss';

const ProductDetails = ({ html }) => {
  return (
    html && (
      <div className={styles.details}>
        <Collapsible title="Product Details">
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: processHtml(html) }}
          />
        </Collapsible>
      </div>
    )
  );
};

export default ProductDetails;
