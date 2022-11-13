import { RiShoppingCart2Line, RiUserLine, RiSearchLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import useCartContext from '@/contexts/CartContext/useCartContext';
import config from '@/config/index';
import styles from './UserButtons.module.scss';

export default function UserButtons() {
  const { toggleSearch, toggleCart, toggleUser } = useGlobalContext();
  const { user } = useUserContext();
  const { cart } = useCartContext();

  const router = useRouter();

  const handleClickUser = () => {
    if (user && user.id) router.push(config.routes.account);
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
      item: (
        <>
          <RiShoppingCart2Line />
          <div className={`${styles.totalItems}`}>
            ({cart?.lines?.length || '0'} items)
          </div>
        </>
      ),
      id: 4,
      onClick: toggleCart,
    },
  ];

  return (
    <div className={styles.container}>
      {data.map((el) => (
        <button
          type="button"
          key={el.id}
          onClick={() => el.onClick()}
          className={styles.button}
        >
          {el.item}
        </button>
      ))}
    </div>
  );
}
