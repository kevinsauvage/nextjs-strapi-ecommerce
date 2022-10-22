import Image from 'next/image';
import Button from '@/components/Button/Button';
import Slide from '@/layout/Slide/Slide';
import routes from '@/data/routes';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import styles from './User.module.scss';

function UserIsNotLoginButtons() {
  return (
    <footer className={styles.footer}>
      <Button
        text="LOGIN"
        tertiary
        href={routes.login}
        extraClass={styles.btn}
      />
      <Button
        text="SIGN UP"
        secondary
        href={routes.register}
        extraClass={styles.btn}
      />
    </footer>
  );
}

function UserIsNotLoginContent() {
  return (
    <div className={styles.auth}>
      <div className={styles.main}>
        <Image src="/logn2.svg" width="300" height="300" alt="user space" />
        <p className={styles.text}>
          Register to create an account or Login to connect to your account.
        </p>
      </div>
    </div>
  );
}

export default function User() {
  const { userOpen, resetToggle } = useGlobalContext();
  const { user } = useUserContext();

  return (
    <Slide
      isOpen={userOpen}
      handleClose={resetToggle}
      title={user ? 'Me' : 'Login or Register'}
      footer={!user && <UserIsNotLoginButtons />}
      content={!user && <UserIsNotLoginContent />}
    />
  );
}
