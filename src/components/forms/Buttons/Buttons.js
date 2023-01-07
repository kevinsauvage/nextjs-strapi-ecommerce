import Button from '@/components/Button/Button';
import styles from './Buttons.module.scss';

function Buttons({ children, text }) {
  return (
    <div className={styles.buttons}>
      <Button text={text} type="submit" contrast />
      {children}
    </div>
  );
}

export default Buttons;
