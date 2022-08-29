import Link from 'next/link';
import routes from '../../data/routes';
import styles from './ShopBtn.module.scss';

export default function ShopBtn() {
  return (
    <Link href={routes.base.shop}>
      <a className={styles.ShopBtn}>Shop Now</a>
    </Link>
  );
}
