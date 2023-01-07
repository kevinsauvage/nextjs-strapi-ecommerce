import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import config from '@/config/index';
import { bag, user } from '@/assets/svg';
import styles from './UserButtons.module.scss';
import ToggleTheme from '../ToggleTheme/ToggleTheme';

export default function UserButtons() {
  const { toggleCheckout } = useGlobalContext();
  const { checkout } = useCheckoutContext();

  const router = useRouter();

  const data = [
    { item: <ToggleTheme />, id: 0 },

    {
      item: user,
      id: 1,
      onClick: () => router.push(config.routes.account),
    },
    {
      item: (
        <>
          {bag}
          <div className={styles.totalItems}>
            <p>{checkout?.linesItem?.length || 0}</p>
          </div>
        </>
      ),
      id: 2,
      onClick: toggleCheckout,
    },
  ];

  return (
    <div className={styles.container}>
      {data.map((el) => (
        <button
          type="button"
          key={el.id}
          onClick={() => el.onClick && el.onClick()}
          className={styles.button}
        >
          {el.item}
        </button>
      ))}
    </div>
  );
}
