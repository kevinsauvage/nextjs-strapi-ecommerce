/* eslint-disable react/no-array-index-key */
import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import config from '@/config/index';
import { bag, user, search } from '@/assets/svg';
import styles from './UserButtons.module.scss';

export default function UserButtons() {
  const { toggleCheckout, toggleSearch, searchOpen } = useGlobalContext();
  const { getTotalItems } = useCheckoutContext();

  const router = useRouter();

  const data = [
    {
      item: <div className={styles.search}> {search}</div>,
      id: 0,
      name: 'Toggle themes',
      onClick: () => toggleSearch(!searchOpen),
    },

    {
      item: user,
      id: 1,
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
      id: 2,
      onClick: toggleCheckout,
      name: 'Toggle Checkout',
    },
  ];

  return (
    <div className={styles.container}>
      {data.map((el, i) => (
        <button
          aria-label="el.name"
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
