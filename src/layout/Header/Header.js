import Link from 'next/link';
import Container from '@/layout/Container/Container';
import UserButtons from '@/components/UserButtons/UserButtons';
import Navbar from '@/components/Navbar/Navbar';
import styles from './Header.module.scss';

function Header() {
  return (
    <header className={`${styles.header}`}>
      <Container>
        <div className={`${styles.inner}`}>
          <Navbar />
          <Link href="/">
            <a className={styles.logo}>
              <p>NAME</p>
            </a>
          </Link>
          <UserButtons />
        </div>
      </Container>
    </header>
  );
}

export default Header;
