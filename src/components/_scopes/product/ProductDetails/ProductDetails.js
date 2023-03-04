/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react';

import Container from '@/components/Container/Container';
import processHtml from '@/helpers/html';

import styles from './ProductDetails.module.scss';

function ProductDetails({ html }) {
  const [htmlSanitized, setHtmlSanitized] = useState();

  useEffect(() => {
    setHtmlSanitized(processHtml(html));
  }, [html]);

  return (
    <Container size="medium">
      <div className={styles.ProductDetails}>
        <h3 className={styles.title}>Product Details</h3>
        <div className={styles.description} dangerouslySetInnerHTML={{ __html: htmlSanitized }} />
      </div>
    </Container>
  );
}

export default ProductDetails;
