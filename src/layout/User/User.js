import Image from 'next/image';
import Button from '@/components/Button/Button';
import Slide from '@/layout/Slide/Slide';
import FlexColumn from '@/layout/FlexColumn/FlexColumn';
import routes from '@/data/routes';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import styles from './User.module.scss';

export default function User() {
  const { userOpen, resetToggle } = useGlobalContext();
  const { user, logout } = useUserContext();

  return (
    <Slide
      isOpen={userOpen}
      handleClose={resetToggle}
      title={user ? 'Me' : 'Login or Register'}
    >
      {user ? (
        <div className={styles.userinfo}>
          <div className={styles.main}>
            <p>Some user data here</p>
          </div>
          <div className={styles.buttons}>
            <Button
              href={routes.account}
              text="PROFILE"
              secondary
              extraClass={styles.btn}
            />
            <Button
              text="LOG OUT"
              tertiary
              onClick={logout}
              extraClass={styles.btn}
            />
          </div>
        </div>
      ) : (
        <>
          <Image src="/logn2.svg" width="300" height="300" alt="user space" />
          <p className={styles.text}>
            Register to create an account or Login to connect to your account.
          </p>
          <FlexColumn gap="0.8rem">
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
          </FlexColumn>
        </>
      )}
    </Slide>
  );
}
