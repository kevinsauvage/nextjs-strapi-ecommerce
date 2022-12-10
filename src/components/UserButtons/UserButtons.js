import { RiShoppingCart2Line, RiUserLine, RiSearchLine } from 'react-icons/ri';
import { useRouter } from 'next/router';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import useCheckoutContext from '@/contexts/CheckoutContext/useCheckoutContext';
import config from '@/config/index';
import styles from './UserButtons.module.scss';

export default function UserButtons() {
  const { toggleSearch, toggleCheckout, toggleUser } = useGlobalContext();
  const { user } = useUserContext();
  const { checkout } = useCheckoutContext();

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
            ({checkout?.lineItems?.length || '0'})
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
