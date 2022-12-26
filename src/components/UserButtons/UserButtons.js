import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import config from '@/config/index';
import Image from 'next/image';
import cart from '../../../public/bag.svg';
import user from '../../../public/user.svg';
import styles from './UserButtons.module.scss';

export default function UserButtons() {
  const { toggleCheckout } = useGlobalContext();
  const { checkout } = useCheckoutContext();

  const router = useRouter();

  const data = [
    {
      item: <Image {...user} alt="user" />,
      id: 3,
      onClick: () => router.push(config.routes.account),
    },
    {
      item: (
        <>
          <Image {...cart} alt="cart" />
          <div className={styles.totalItems}>
            <p className={styles.totalItemTitle}>Shopping Cart</p>
            <p className={styles.price}>
              {checkout?.totalPrice?.amount || 0}{' '}
              {checkout?.totalPrice?.currencyCode}
            </p>
          </div>
        </>
      ),
      id: 4,
      onClick: toggleCheckout,
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
