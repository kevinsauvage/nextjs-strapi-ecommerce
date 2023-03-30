import useHideScrollbar from '@/hooks/useHideScrollbar';

import Loader from '../Loader/Loader';

import styles from './PageLoader.module.scss';

const PageLoader = ({ position }) => {
  useHideScrollbar();
  return (
    <div className={`${styles.loader} fade-in`} style={{ position }}>
      <Loader />
    </div>
  );
};

export default PageLoader;
