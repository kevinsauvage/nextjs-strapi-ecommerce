import styles from './ProductDetails.module.scss';

function ProductDetails({ html }) {
  return (
    <div className={styles.ProductDetails}>
      <h3 className={styles.title}>Product Details</h3>
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default ProductDetails;
