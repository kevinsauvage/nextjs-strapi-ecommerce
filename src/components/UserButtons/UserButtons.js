/* eslint-disable react/no-array-index-key */
import { useRouter } from 'next/router';

import { bag, heart, search, user } from '@/assets/svg';
import config from '@/config/index';
import useCartContext from '@/contexts/CartContext/useCartContext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';

import styles from './UserButtons.module.scss';

export default function UserButtons() {
  const { toggleSearch, searchOpen } = useGlobalContext();
  const { getTotalItems } = useCartContext();

  const { push, pathname } = useRouter();

  const data = [
    {
      item: search,
      id: 0,
      name: 'Search',
      onClick: () => !pathname.startsWith('/search') && toggleSearch(!searchOpen),
    },

    {
      item: heart,
      id: 1,
      name: 'Wishlist',
      onClick: () => push(config.routes.wishlist),
    },

    {
      item: user,
      id: 2,
      onClick: () => push(config.routes.account),
      name: 'User account',
    },
    {
      item: (
        <div className={styles.cart}>
          {bag}
          {getTotalItems() && (
            <div className={styles.totalItems}>
              <p>{getTotalItems()}</p>
            </div>
          )}
        </div>
      ),
      id: 3,
      onClick: () => push(config.routes.cart),
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
