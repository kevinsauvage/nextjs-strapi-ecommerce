import Image from 'next/image';
import { useRouter } from 'next/router';

import Button from '@/components/Button/Button';
import config from '@/config/index';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';

import styles from './EmptyCart.module.scss';

export default function EmptyCart() {
  const router = useRouter();
  const { resetToggle } = useGlobalContext();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your cart is empty</h2>
      <Image src="/emptyCart.svg" width="200" height="200" alt="Empty cart" className={styles.image} />
      <Button
        text="CONTINUE SHOPPING"
        primary
        extraClass={styles.btn}
        onClick={() => {
          resetToggle();
          router.push(config.routes.collection);
        }}
      />
    </div>
  );
}
