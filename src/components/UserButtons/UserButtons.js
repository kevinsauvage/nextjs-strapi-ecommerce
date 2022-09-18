import { useContext } from 'react';
import { RiShoppingCart2Line, RiUserLine, RiSearchLine } from 'react-icons/ri';
import { CartContext } from '@/contexts/CartContext/CartContext';
import { GlobalStoreContext } from '@/contexts/GlobalContext/GlobalContext';
import HeaderButton from '@/components/HeaderButton/HeaderButton';
import { UserContext } from '@/contexts/UserContext/UserContext';
import routes from '@/data/routes';
import { useRouter } from 'next/router';
import styles from './UserButtons.module.scss';

export default function UserButtons() {
  const { toggleSearch, toggleCart, toggleUser } =
    useContext(GlobalStoreContext);

  const router = useRouter();

  const { user } = useContext(UserContext);

  const { cart } = useContext(CartContext);

  const handleClickUser = () => {
    if (user && user.id) router.push(routes.base.profile);
    else toggleUser();
  };

  const data = [
    {
      item: <RiSearchLine />,
      id: 1,
      onClick: toggleSearch,
    },

    {
      item: <RiUserLine />,
      id: 3,
      onClick: handleClickUser,
    },
    {
      item: <RiShoppingCart2Line />,
      id: 4,
      onClick: toggleCart,
    },
  ];

  return (
    <div className={styles.container}>
      {data.map((el) => (
        <HeaderButton
          type="button"
          key={el.id}
          handleClick={() => el.onClick()}
        >
          {el.item}
        </HeaderButton>
      ))}
      <div className={`${styles.totalItems}`}>
        {cart?.lineItems?.length || '0'}
      </div>
    </div>
  );
}
