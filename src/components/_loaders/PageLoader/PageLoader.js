import Loader from '../Loader/Loader';

import styles from './PageLoader.module.scss';

const PageLoader = ({ position }) => {
  return (
    <div className={`${styles.loader} fadeIn`} style={{ position }}>
      <Loader />
    </div>
  );
};

export default PageLoader;
