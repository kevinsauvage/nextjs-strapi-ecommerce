import Loader from '../Loader/Loader';

import styles from './AbsoluteLoader.module.scss';

const AbsoluteLoader = ({ text }) => (
  <div className={styles.loader}>
    <div>{text || <Loader />}</div>
  </div>
);

export default AbsoluteLoader;
