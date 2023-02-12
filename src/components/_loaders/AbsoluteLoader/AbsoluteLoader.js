import Loader from '../Loader/Loader';
import styles from './AbsoluteLoader.module.scss';

export default function AbsoluteLoader({ text }) {
  return (
    <div className={styles.loader}>
      <div>{text || <Loader />}</div>
    </div>
  );
}
