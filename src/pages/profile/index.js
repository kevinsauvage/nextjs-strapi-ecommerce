import { useContext } from 'react';
import Button from '../../components/Button/Button';
import { messages } from '../../config/i18n';
import { UserContext } from '../../contexts/UserContext/UserContext';

function Profile({ user = {} }) {
  const { logOut } = useContext(UserContext);
  return (
    <div>
      <div>Username: {user?.username}</div>
      <div>Email: {user?.email}</div>
      <Button text="Logout" onClick={logOut} />
    </div>
  );
}

export default Profile;

export const getStaticProps = async (ctx) => ({
  props: {
    messages: messages[ctx.locale],
  },
});
