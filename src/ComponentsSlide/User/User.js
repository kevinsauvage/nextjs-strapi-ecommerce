import { useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { GlobalStoreContext } from '../../contexts/GlobalContext/GlobalContext';
import { UserContext } from '../../contexts/UserContext/UserContext';
import Button from '../../components/Button/Button';
import Slide from '../../components/Slide/Slide';
import FlexColumn from '../../components/FlexColumn/FlexColumn';
import styles from './User.module.scss';
import routes from '../../data/routes';

export default function User() {
  const { userOpen, resetToggle } = useContext(GlobalStoreContext);
  const { user, logOut } = useContext(UserContext);

  const router = useRouter();

  return (
    <Slide
      isOpen={userOpen}
      handleClose={resetToggle}
      title={user.id ? `${`${user.username}`}` : 'Login or Register'}
    >
      {user && user.id ? (
        <div>
          <p>{user.email}</p>
          <Button
            text="User Profile"
            secondary
            onClick={() => router.push(routes.base.profile)}
          />
          <Button text="Log out " tertiary onClick={logOut} />
        </div>
      ) : (
        <>
          <Image src="/logn2.svg" width="300" height="300" />
          <p className={styles.text}>
            Register to create an account or Login to connect to your account.
          </p>
          <FlexColumn gap="0.8rem">
            <Button
              text="Login"
              tertiary
              onClick={() => router.push(routes.base.login)}
            />

            <Button
              text="Register"
              secondary
              onClick={() => router.push(routes.base.register)}
            />
          </FlexColumn>
        </>
      )}
    </Slide>
  );
}
