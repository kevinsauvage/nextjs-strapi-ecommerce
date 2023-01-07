import { useEffect, useState } from 'react';
import styles from './ToggleTheme.module.scss';

function ToggleTheme() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = document.querySelector('html');
    if (!element.classList.contains('theme--default')) {
      setIsActive(true);
    }
  }, []);

  const handleClick = () => {
    const element = document.querySelector('html');
    if (!isActive) {
      element.classList.remove('theme--default');
      element.classList.add('theme--dark');
    } else {
      element.classList.remove('theme--dark');
      element.classList.add('theme--default');
    }
    setIsActive((prev) => !prev);
  };
  return (
    <div
      role="button"
      tabIndex={0}
      name="toggleTheme"
      aria-label="toggleTheme"
      className={`${styles.toggleTheme} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      <div className={styles.inner} />
    </div>
  );
}

export default ToggleTheme;
