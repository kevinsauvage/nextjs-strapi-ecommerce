import Loader from '../Loader/Loader';

import styles from './BlockLoader.module.scss';

const BlockLoader = () => (
  <div className={styles.loader}>
    <Loader />
  </div>
);

export default BlockLoader;
