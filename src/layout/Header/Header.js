import Container from '@/layout/Container/Container';
import UserButtons from '@/components/UserButtons/UserButtons';
import Navbar from '@/components/Navbar/Navbar';
import Logo from '@/components/Logo/Logo';
import styles from './Header.module.scss';

function Header({ headerMenu }) {
  return (
    <header className={`${styles.header}`}>
      <Container>
        <Logo />
        <Navbar headerMenu={headerMenu} />
        <UserButtons />
      </Container>
    </header>
  );
}

export default Header;
