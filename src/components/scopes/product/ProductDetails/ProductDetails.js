import Separator from '@/components/Separator/Separator';
import styles from './ProductDetails.module.scss';

function ProductDetails({ html }) {
  return (
    <div className={styles.ProductDetails}>
      <h5 className={styles.title}>Details</h5>
      <Separator />
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

export default ProductDetails;
