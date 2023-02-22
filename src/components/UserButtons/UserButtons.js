/* eslint-disable react/no-array-index-key */
import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import config from '@/config/index';
import { bag, user, search, heart } from '@/assets/svg';
import useCartContext from '@/contexts/CartContext/useCartContext';

import styles from './UserButtons.module.scss';

export default function UserButtons() {
  const { toggleSearch, searchOpen } = useGlobalContext();
  const { getTotalItems } = useCartContext();

  const router = useRouter();

  const data = [
    {
      item: <div className={styles.search}> {search}</div>,
      id: 0,
      name: 'Search',
      onClick: () => toggleSearch(!searchOpen),
    },

    {
      item: heart,
      id: 1,
      name: 'Wishlist',
      onClick: () => router.push(config.routes.wishlist),
    },

    {
      item: user,
      id: 2,
      onClick: () => router.push(config.routes.account),
      name: 'User account',
    },
    {
      item: (
        <div className={styles.cart}>
          {bag}
          <div className={styles.totalItems}>
            <p>{getTotalItems() || 0}</p>
          </div>
        </div>
      ),
      id: 3,
      onClick: () => router.push(config.routes.cart),
      name: 'Toggle Checkout',
    },
  ];

  return (
    <div className={styles.container}>
      {data.map((el, i) => (
        <button
          aria-label={el.name}
          type="button"
          key={i}
          onClick={() => el.onClick && el.onClick()}
          className={styles.button}
        >
          {el.item}
        </button>
      ))}
    </div>
  );
}
