import Link from 'next/link';
import NextImage from '../Image/Image';
import styles from './ProductList.module.scss';

function ProductsList({ products }) {
  return (
    <div className={styles.container}>
      {Array.isArray(products) &&
        products.map((_product) => (
          <div key={_product.id} className={styles.card}>
            <Link href={`/products/${_product.id}`}>
              <a>
                <div className="">
                  <NextImage
                    media={
                      _product.attributes.img_url?.data?.attributes?.formats
                        ?.medium
                    }
                  />
                </div>
                <div className="">
                  <h4 className="">{_product.attributes?.title}</h4>
                  <div className="">{_product.attributes?.description}</div>
                </div>
              </a>
            </Link>
          </div>
        ))}
    </div>
  );
}

export default ProductsList;
