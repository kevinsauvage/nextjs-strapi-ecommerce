import Container from '@/layout/Container/Container';
import ActiveLink from '@/components/ActiveLink/ActiveLink';
import styles from './Footer.module.scss';

function Footer({ menuFooter, shopInfo }) {
  return (
    <footer className={styles.container}>
      <Container>
        <div className={styles.top}>
          <div>
            <h4 className={styles.title}>About</h4>
            <p className={styles.navItem}>{shopInfo?.description}</p>
          </div>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {Array.isArray(menuFooter) &&
                menuFooter.map((item) => (
                  <li key={item.id}>
                    <h4 className={styles.title}>{item.title}</h4>
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
          </nav>
        </div>
        <div className={styles.bottom}>
          <p>Copyright © 2022 All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
