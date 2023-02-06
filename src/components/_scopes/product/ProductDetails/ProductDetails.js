import { useEffect, useState } from 'react';
import processHtml from '@/helpers/html';
import styles from './ProductDetails.module.scss';

function ProductDetails({ html }) {
  const [htmlSanitized, setHtmlSanitized] = useState();

  useEffect(() => {
    setHtmlSanitized(processHtml(html));
  }, [html]);

  return (
    <div className={styles.ProductDetails}>
      <h3 className={styles.title}>Product Details</h3>
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: htmlSanitized }} />
    </div>
  );
}

export default ProductDetails;
