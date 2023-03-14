import Container from '@/components/Container/Container';

import styles from './PageBanner.module.scss';

const PageBanner = ({ title, children }) => {
  return (
    <div className={styles.PageBanner}>
      <Container>
        <h1 className={styles.title}>{title}</h1>
        {children}
      </Container>
    </div>
  );
};

export default PageBanner;
