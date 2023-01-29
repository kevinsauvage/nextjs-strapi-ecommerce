import { useEffect, useState } from 'react';
import styles from './ToggleTheme.module.scss';

function ToggleTheme() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const isDarkTheme = window.localStorage.getItem('isDarkTheme');
    if (isDarkTheme) {
      const element = document.querySelector('html');
      element.classList.add('theme--dark');
      setIsActive(true);
    }
  }, []);

  const handleClick = () => {
    const element = document.querySelector('html');
    if (!isActive) {
      element.classList.remove('theme--default');
      element.classList.add('theme--dark');
      window.localStorage.setItem('isDarkTheme', null);
    } else {
      element.classList.remove('theme--dark');
      element.classList.add('theme--default');
      window.localStorage.removeItem('isDarkTheme');
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

      <svg
        className={styles.sun}
        width="16"
        height="16"
        viewBox="0 0 170 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M84.9473 134.963C112.57 134.963 134.963 112.57 134.963 84.9473C134.963 57.3244 112.57 34.9315 84.9473 34.9315C57.3244 34.9315 34.9316 57.3244 34.9316 84.9473C34.9316 112.57 57.3244 134.963 84.9473 134.963Z"
          stroke="white"
          stroke-width="11.5421"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M139.888 139.888L138.887 138.887M138.887 31.0072L139.888 30.0069L138.887 31.0072ZM30.0069 139.888L31.0072 138.887L30.0069 139.888ZM84.9473 8.61558V8V8.61558ZM84.9473 161.895V161.279V161.895ZM8.61558 84.9473H8H8.61558ZM161.895 84.9473H161.279H161.895ZM31.0072 31.0072L30.0069 30.0069L31.0072 31.0072Z"
          stroke="white"
          stroke-width="15.3895"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <svg
        className={styles.moon}
        width="14"
        height="14"
        viewBox="0 0 161 166"
        fill="bleu"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.20899 86.2164C8.97909 125.844 42.6051 158.085 82.8485 159.855C111.242 161.086 136.635 147.851 151.87 126.998C158.18 118.457 154.794 112.763 144.252 114.687C139.097 115.61 133.788 115.995 128.247 115.764C90.6202 114.225 59.8412 82.7537 59.6874 45.5882C59.6104 35.585 61.688 26.1205 65.4584 17.5024C69.6136 7.96096 64.612 3.42107 54.9936 7.49927C24.5224 20.3495 3.66973 51.0514 6.20899 86.2164Z"
          stroke="white"
          stroke-width="11.5421"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
}

export default ToggleTheme;
