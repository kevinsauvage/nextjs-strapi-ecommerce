import { useContext } from 'react';
import { RiShoppingCart2Line, RiUserLine, RiSearchLine } from 'react-icons/ri';
import { CartContext } from '@/contexts/CartContext/CartContext';
import { GlobalStoreContext } from '@/contexts/GlobalContext/GlobalContext';
import HeaderButton from '@/components/HeaderButton/HeaderButton';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import styles from './UserButtons.module.scss';

export default function UserButtons({ isActive }) {
  const { toggleSearch, toggleCart, toggleUser } =
    useContext(GlobalStoreContext);

  const { cart } = useContext(CartContext);

  const data = [
    {
      item: <RiSearchLine />,
      id: 1,
      onClick: toggleSearch,
    },

    {
      item: <RiUserLine />,
      id: 3,
      onClick: toggleUser,
    },
    {
      item: <RiShoppingCart2Line />,
      id: 4,
      onClick: toggleCart,
    },
  ];

  return (
    <div className={styles.container}>
      <LanguageSwitcher />
      {data.map((el) => (
        <HeaderButton
          type="button"
          key={el.id}
          handleClick={() => el.onClick()}
        >
          {el.item}
        </HeaderButton>
      ))}
      <div className={`${styles.totalItems} ${isActive ? styles.active : ''}`}>
        {cart?.lineItems?.length || '0'}
      </div>
    </div>
  );
}
