import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { messages } from '../../config/i18n';
import { getShopifyClient, parseShopifyResponse } from '../../lib/shopify';
import Page from '../../components/Page/Page';
import Container from '../../components/Container/Container';
import PhotoGallery from '../../components/PhotoGallery/PhotoGallery';
import styles from './slug.module.scss';
import Button from '../../components/Button/Button';
import { CartContext } from '../../contexts/CartContext/CartContext';

function ProductPage({ product }) {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;
  const { addToCart } = useContext(CartContext);

  const { title, description, availableForSale, descriptionHtml, variants } =
    product;

  const [selected, setSelected] = useState(variants?.[0]);

  return (
    <Page title={title} description={description}>
      <Container>
        <div className={styles.content}>
          <PhotoGallery
            items={variants}
            handleSelect={(item) => setSelected(item)}
            selected={selected}
          />

          <div>
            <h4 className="">
              {title} - {selected.priceV2.currencyCode}
              {selected.priceV2.amount}
            </h4>
            <div
              className=""
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
            {availableForSale && (
              <Button
                type="button"
                text="Add to cart"
                tertiary
                onClick={() => addToCart(selected, 1)}
              />
            )}
          </div>

          {!availableForSale && (
            <div className="">
              <div className="" role="alert">
                <span className="">Coming soon...</span>
                <span className="">This article is not available yet.</span>
              </div>
            </div>
          )}
        </div>
      </Container>
    </Page>
  );
}

export default ProductPage;

export async function getStaticProps({ params, locale }) {
  const data = await getShopifyClient(locale).product.fetchByHandle(
    params.slug
  );
  return {
    props: { product: parseShopifyResponse(data), messages: messages[locale] },
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths({ locales }) {
  const data = await getShopifyClient().product.fetchAll();
  const products = parseShopifyResponse(data);

  const paths = locales.reduce(
    (acc, next) => [
      ...acc,
      ...products.map((product) => ({
        params: { slug: String(product.handle) },
        locale: next,
      })),
    ],
    []
  );

  return {
    paths,
    fallback: true,
  };
}
