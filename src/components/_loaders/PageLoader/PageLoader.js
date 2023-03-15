import Loader from '../Loader/Loader';

import styles from './PageLoader.module.scss';

const PageLoader = ({ position }) => (
  <div className={`${styles.loader} fade-in`} style={{ position }}>
    <Loader />
  </div>
);

export default PageLoader;
