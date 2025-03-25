import { useRouter } from 'next/navigation';

import styles from './BackButtons.module.scss';

const BackButton = () => {
  const { back } = useRouter();
  return (
    <div
      className={styles.back}
      onClick={() => back()}
      role="button"
      tabIndex={0}
      onKeyDown={() => back()}
    >
      <strong>BACK</strong>
    </div>
  );
};

export default BackButton;
