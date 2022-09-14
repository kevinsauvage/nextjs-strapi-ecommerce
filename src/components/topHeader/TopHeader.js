import ContactMail from '../ContactMail/ContactMail';
import Container from '../Container/Container';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import styles from './topHeader.module.scss';

export default function TopHeader() {
  return (
    <div className={styles.topHeader}>
      <Container>
        <ContactMail />
        <LanguageSwitcher />
      </Container>
    </div>
  );
}
