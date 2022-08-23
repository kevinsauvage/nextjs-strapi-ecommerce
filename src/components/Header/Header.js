import Link from 'next/link';
import styles from './Header.module.scss';
import UserButtons from '../UserButtons/UserButtons';
import Wrapper from '../Wrapper/Wrapper';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import Navbar from '../Navbar/Navbar';
import PhoneNumber from '../PhoneNumber/PhoneNumber';
import Container from '../Container/Container';
import ContactMail from '../ContactMail/ContactMail';

function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Container>
          <Wrapper>
            <PhoneNumber />
            <ContactMail />
          </Wrapper>
          <LanguageSwitcher />
        </Container>
      </div>

      <div className={styles.bottom}>
        <Container>
          <Link href="/">
            <a className={styles.logo}>
              <h2>Logo</h2>
            </a>
          </Link>
          <Navbar />
          <Wrapper gap="0rem">
            <UserButtons />
          </Wrapper>
        </Container>
      </div>
    </div>
  );
}

export default Header;
