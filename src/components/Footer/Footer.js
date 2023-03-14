import ActiveLink from '@/components/ActiveLink/ActiveLink';
import Container from '@/components/Container/Container';
import siteMetadata from '@/data/siteMetadata';

import styles from './Footer.module.scss';

const Footer = ({ menuFooter }) => {
  return (
    <>
      <footer className={styles.footer}>
        <Container extraClass={styles.container}>
          <div className={styles.about}>
            <b className={styles.title}>About</b>
            <p className={styles.navItem}>{siteMetadata?.about?.short}</p>
          </div>
          <ul className={styles.navList}>
            {Array.isArray(menuFooter) &&
              menuFooter.map((item) => (
                <li key={item.id}>
                  <b className={styles.title}>{item.title}</b>
                  <ul className={styles.nav}>
                    {item?.items?.map((el) => (
                      <li className={styles.navItem} key={el.id}>
                        <ActiveLink url={el?.url}>{el?.title}</ActiveLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        </Container>
      </footer>
      <div className={styles.bottom}>
        <Container>
          <p>Copyright © 2022 All rights reserved.</p>
        </Container>
      </div>
    </>
  );
};

export default Footer;
