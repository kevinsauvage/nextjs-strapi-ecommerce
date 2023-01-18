import Container from '@/components/Container/Container';
import ActiveLink from '@/components/ActiveLink/ActiveLink';
import styles from './Footer.module.scss';

function Footer({ menuFooter, shopInfo }) {
  return (
    <Container extraClass={styles.container}>
      <footer className={styles.footer}>
        <div>
          <b className={styles.title}>About</b>
          <p className={styles.navItem}>{shopInfo?.description}</p>
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
      </footer>
      <div className={styles.bottom}>
        <p>Copyright © 2022 All rights reserved.</p>
      </div>
    </Container>
  );
}

export default Footer;
