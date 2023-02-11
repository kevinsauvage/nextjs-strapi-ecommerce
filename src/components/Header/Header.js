import Container from '@/components/Container/Container';
import UserButtons from '@/components/UserButtons/UserButtons';
import Navbar from '@/components/Navbar/Navbar';
import Logo from '@/components/Logo/Logo';
import styles from './Header.module.scss';

function Header({ headerMenu }) {
  return (
    <header className={`${styles.header}`}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.left}>
            <Logo />
            <Navbar headerMenu={headerMenu} />
          </div>
          <UserButtons />
        </div>
      </Container>
    </header>
  );
}

export default Header;
