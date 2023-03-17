import Head from 'next/head';

import config from '@/config/index';

import styles from './PageLayout.module.scss';

const PageLayout = ({ children, title, description }) => {
  const secundaryTitle = title ? `| ${title}` : '';
  const siteTitle = `${config.name} ${secundaryTitle}`;

  if (!title) {
    console.error('PageLayout: missing title');
  }

  return (
    <div className={`${styles.page}`}>
      <Head>
        <title key="title">{siteTitle}</title>
        {description && <meta key="description" name="description" content={description} />}
      </Head>

      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default PageLayout;
