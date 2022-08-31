import PhotoGallery from '../PhotoGallery/PhotoGallery';
import ProductDescription from '../ProductDescription/ProductDescription';
import styles from './ProductPresenter.module.scss';

export default function ProductPresenter({ product }) {
  return (
    <div className={styles.container}>
      <PhotoGallery items={product.variants} />
      <ProductDescription product={product} />
    </div>
  );
}
