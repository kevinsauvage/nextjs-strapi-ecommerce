import { useContext } from 'react';
import Image from 'next/image';
import { GlobalStoreContext } from '@/contexts/GlobalContext/GlobalContext';
import { UserContext } from '@/contexts/UserContext/UserContext';
import Button from '@/components/Button/Button';
import Slide from '@/components/Slide/Slide';
import FlexColumn from '@/components/FlexColumn/FlexColumn';
import routes from '@/data/routes';
import styles from './User.module.scss';

export default function User() {
  const { userOpen, resetToggle } = useContext(GlobalStoreContext);
  const { user, logOut } = useContext(UserContext);

  return (
    <Slide
      isOpen={userOpen}
      handleClose={resetToggle}
      title={user.id ? 'Me' : 'Login or Register'}
    >
      {user && user.id ? (
        <div className={styles.userinfo}>
          <div className={styles.main}>
            <p>Some user data here</p>
          </div>
          <div className={styles.buttons}>
            <Button
              href={routes.base.profile}
              text="PROFILE"
              secondary
              extraClass={styles.btn}
            />
            <Button
              text="LOG OUT"
              tertiary
              onClick={() => logOut()}
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
              href={routes.base.login}
              extraClass={styles.btn}
            />
            <Button
              text="SIGN UP"
              secondary
              href={routes.base.register}
              extraClass={styles.btn}
            />
          </FlexColumn>
        </>
      )}
    </Slide>
  );
}
