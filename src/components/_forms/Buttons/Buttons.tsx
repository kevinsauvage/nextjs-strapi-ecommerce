import Button from '@/components/Button/Button';

import styles from './Buttons.module.scss';

const Buttons = ({ children, text }: { children?: React.ReactNode; text?: string }) => (
  <div className={styles.buttons}>
    <Button text={text} type="submit" primary />
    {children}
  </div>
);

export default Buttons;
