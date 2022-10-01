import { RiShoppingCart2Line, RiUserLine, RiSearchLine } from 'react-icons/ri';
import HeaderButton from '@/components/HeaderButton/HeaderButton';
import routes from '@/data/routes';
import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import useCartContext from '@/contexts/CartContext/useCartContext';
import styles from './UserButtons.module.scss';

export default function UserButtons() {
  const { toggleSearch, toggleCart, toggleUser } = useGlobalContext();
  const { user } = useUserContext();
  const { cart } = useCartContext();

  const router = useRouter();

  const handleClickUser = () => {
    if (user && user.id) router.push(routes.account);
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
      <div className={`${styles.totalItems}`}>{cart?.lines?.length || '0'}</div>
    </div>
  );
}
