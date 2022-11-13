import Container from '@/layout/Container/Container';
import UserButtons from '@/components/UserButtons/UserButtons';
import Navbar from '@/components/Navbar/Navbar';
import Logo from '@/components/Logo/Logo';
import styles from './Header.module.scss';

function Header() {
  return (
    <header className={`${styles.header}`}>
      <Container>
        <Logo />
        <Navbar />
        <UserButtons />
      </Container>
    </header>
  );
}

export default Header;
