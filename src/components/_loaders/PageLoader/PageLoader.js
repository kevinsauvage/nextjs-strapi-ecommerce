import Loader from '../Loader/Loader';
import styles from './PageLoader.module.scss';

export default function PageLoader({ position }) {
  return (
    <div className={`${styles.loader} fadeIn`} style={{ position }}>
      <Loader />
    </div>
  );
}
