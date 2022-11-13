import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Button from '@/components/Button/Button';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import config from '@/config/index';
import styles from './EmptyCart.module.scss';

export default function EmptyCart() {
  const router = useRouter();
  const { resetToggle } = useGlobalContext();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your cart is empty</h2>
      <p className={styles.subtitle}>
        Something missing? <Link href={config.routes.login}>Sign in </Link>
        to see items you may have added from another computer or device.
      </p>
      <Image src="/emptyCart.svg" width="200" height="200" alt="Empty cart" />
      <Button
        text="CONTINUE SHOPPING"
        secondary
        extraClass={styles.btn}
        onClick={() => {
          resetToggle();
          router.push(config.routes.collection);
        }}
      />
    </div>
  );
}
