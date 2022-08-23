import Link from 'next/link';
import Container from '../Container/Container';
import styles from './Footer.module.scss';

function Footer() {
  return (
    <footer className={styles.container}>
      <Container>
        <div className={styles.top} />
        <div className={styles.bottom}>
          <p>Copyright © 2022 All rights reserved.</p>
          <nav>
            <ul className={styles.list}>
              <li className={styles.item}>
                <Link href="/terms">Term and condition</Link>
              </li>
              /
              <li className={styles.item}>
                <Link href="/privacy">Privacy policy</Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
