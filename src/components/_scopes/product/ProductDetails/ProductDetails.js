/* eslint-disable react/no-danger */
import { useEffect, useState } from 'react';

import Collapsible from '@/components/Collapsible/Collapsible';
import processHtml from '@/helpers/html';

import styles from './ProductDetails.module.scss';

const ProductDetails = ({ html }) => {
  const [htmlSanitized, setHtmlSanitized] = useState();

  useEffect(() => {
    setHtmlSanitized(processHtml(html));
  }, [html]);

  return (
    htmlSanitized && (
      <div className={styles.details}>
        <Collapsible title="Product Details">
          <div className={styles.description} dangerouslySetInnerHTML={{ __html: htmlSanitized }} />
        </Collapsible>
      </div>
    )
  );
};

export default ProductDetails;
