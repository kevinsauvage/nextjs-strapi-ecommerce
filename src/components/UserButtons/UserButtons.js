/* eslint-disable react/no-array-index-key */
import { useRouter } from 'next/router';

import { bag, heart, search, user } from '@/assets/svg';
import config from '@/config/index';
import useCartContext from '@/contexts/CartContext/useCartContext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';

import styles from './UserButtons.module.scss';

const UserButtons = () => {
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
      extraClass: styles.wishlist,
      onClick: () => push(config.routes.wishlist),
    },

    {
      item: user,
      id: 2,
      extraClass: styles.user,
      onClick: () => push(config.routes.account),
      name: 'User account',
    },
    {
      item: (
        <div className={styles.cart}>
          {bag}
          {getTotalItems() && (
            <div className={styles['total-items']}>
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
      {data.map((element) => (
        <button
          aria-label={element.name}
          type="button"
          key={element.id}
          onClick={() => element.onClick?.()}
          className={`${styles.button} ${element.extraClass}`}
        >
          {element.item}
        </button>
      ))}
    </div>
  );
};

export default UserButtons;
