import Container from '@/components/Container/Container';

import styles from './PageBanner.module.scss';

function PageBanner({ title, children }) {
  return (
    <div className={styles.PageBanner}>
      <Container>
        <h1 className={styles.title}>{title}</h1>
        {children}
      </Container>
    </div>
  );
}

export default PageBanner;
