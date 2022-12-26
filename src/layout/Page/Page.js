import Head from 'next/head';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import config from '@/config/index';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import Link from 'next/link';
import styles from './Page.module.scss';
import Container from '../Container/Container';
import PageLoader from '../Loader/PageLoader/PageLoader';

export default function Page({
  children,
  title,
  description,
  loading,
  backTo,
  bannerTitle,
  bannerDescription,
}) {
  const siteTitle = `${config.name} | ${title}`;
  return (
    <div className={`${styles.page}`}>
      <Head>
        <title>{siteTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <Container>
        {loading && <PageLoader />}
        <Breadcrumbs />

        {bannerDescription && bannerTitle && (
          <div className={styles.banner}>
            {backTo && (
              <Link href={backTo.href} className={styles.backTo}>
                <MdOutlineKeyboardBackspace />
                {backTo.name}
              </Link>
            )}
            <h1 className={styles.title}>{bannerTitle}</h1>
            <p className={styles.subtitle}>{bannerDescription}</p>
          </div>
        )}
        <div className={styles.children}>{children}</div>
      </Container>
    </div>
  );
}
