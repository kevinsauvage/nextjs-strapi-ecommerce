import { useRouter } from 'next/navigation';

import styles from './BackButtons.module.scss';

const BackButton = () => {
  const router = useRouter();
  return (
    <div
      className={styles.back}
      onClick={() => router.back()}
      role="button"
      tabIndex={0}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' || event.key === ' ') {
          router.back();
        }
      }}
    >
      <strong>BACK</strong>
    </div>
  );
};

export default BackButton;
