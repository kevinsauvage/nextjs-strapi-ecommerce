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
      id: 0,
      item: search,
      name: 'Search',
      onClick: () => !pathname.startsWith('/search') && toggleSearch(!searchOpen),
    },

    {
      extraClass: styles.wishlist,
      id: 1,
      item: heart,
      name: 'Wishlist',
      onClick: () => push(config.routes.wishlist),
    },

    {
      extraClass: styles.user,
      id: 2,
      item: user,
      name: 'User account',
      onClick: () => push(config.routes.account),
    },
    {
      id: 3,
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
      name: 'Toggle Checkout',
      onClick: () => push(config.routes.cart),
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
