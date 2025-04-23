import Button from '@/components/Button/Button';
import config from '@/config';

import styles from './AddNewButton.module.scss';

const AddNewButton = () => {
  return (
    <Button extraClass={styles.button} href={config.routes.createAddress}>
      Add new address
    </Button>
  );
};

export default AddNewButton;
