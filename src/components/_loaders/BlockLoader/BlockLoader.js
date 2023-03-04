import Loader from '../Loader/Loader';

import styles from './BlockLoader.module.scss';

function BlockLoader() {
  return (
    <div className={styles.BlockLoader}>
      <Loader />
    </div>
  );
}

export default BlockLoader;
