import ActiveLink from '@/components/ActiveLink/ActiveLink';
import Container from '@/components/Container/Container';
import siteMetadata from '@/data/siteMetadata';
import { storefrontSdk } from '@/shopify';

import styles from './Footer.module.scss';

const Footer = async () => {
  const response = await storefrontSdk().getMenuByHandle({ handle: 'footer' });
  const menuFooter = response?.menu.items;

  return (
    <>
      <footer className={styles.footer}>
        <Container extraClass={styles.container}>
          <div className={styles.about}>
            <b className={styles.title}>About</b>
            <p className={styles['nav-item']}>{siteMetadata?.about?.short}</p>
          </div>
          <ul className={styles['nav-list']}>
            {Array.isArray(menuFooter) &&
              menuFooter.map((item) => (
                <li key={item.id}>
                  <b className={styles.title}>{item.title}</b>
                  <ul>
                    {item?.items?.map((element) => (
                      <li className={styles['nav-item']} key={element.id}>
                        {typeof element?.url === 'string' && (
                          <ActiveLink url={element?.url}>{element?.title}</ActiveLink>
                        )}
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
