import Button from '@/components/Button/Button';
import { useRouter } from 'next/router';
import styles from './Buttons.module.scss';

function Buttons({ text, backButton }) {
  const { back } = useRouter();
  return (
    <div className={styles.buttons}>
      <Button text={text} type="submit" contrast />
      {backButton ? (
        <div
          className={styles.back}
          onClick={() => back()}
          role="button"
          tabIndex={0}
          onKeyDown={() => back()}
        >
          <strong>BACK</strong>
        </div>
      ) : null}
    </div>
  );
}

export default Buttons;
