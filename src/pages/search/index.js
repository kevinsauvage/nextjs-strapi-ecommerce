import { useRouter } from 'next/router';
import Page from '@/components/Page/Page';
import { useTranslations } from 'next-intl';
import {
  Configure,
  CurrentRefinements,
  DynamicWidgets,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
  SortBy,
  useInstantSearch,
} from 'react-instantsearch-hooks-web';
import Image from 'next/image';
import styles from './Search.module.scss';

function Hit({ hit }) {
  return (
    <article>
      <Image
        src={hit.image}
        alt={hit.name}
        layout="responsive"
        width={200}
        height={200}
      />
      <p>{hit.categories?.[0]}</p>
      <h1>
        <Highlight attribute="title" hit={hit} />
      </h1>
      <p>${hit.price}</p>
    </article>
  );
}

function Search() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;
  const t = useTranslations('page.search');
  const data = useInstantSearch();
  console.log(data);

  return (
    <Page title={t('title')}>
      <div className={styles.search}>
        <Configure hitsPerPage={40} />
        <SearchBox />
        <RefinementList attribute="price_range" />
        <RefinementList attribute="tags" />
        <RefinementList attribute="options.color" />
        <SortBy
          items={[
            { label: 'Featured', value: 'Featured' },
            { label: 'Price (asc)', value: 'price_asc' },
            { label: 'Price (desc)', value: 'price_dsc' },
          ]}
        />
        <CurrentRefinements />

        <Hits hitComponent={Hit} />
        <Pagination />
      </div>
    </Page>
  );
}

export default Search;

export const getStaticProps = async ({ locale }) => ({
  props: {
    messages: (await import(`../../locales/${locale}.json`)).default,
  },
});
