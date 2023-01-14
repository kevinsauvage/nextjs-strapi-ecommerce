import { useEffect } from 'react';
import styles from './Toast.module.scss';

export default function Toast({ toasts, toastDispatch }) {
  function renderItem(content) {
    if (typeof content === 'function') {
      return content();
    }
    return <p>{content}</p>;
  }

  useEffect(() => {
    if (toasts.length) {
      setTimeout(() => {
        toastDispatch({ type: 'REMOVE', payload: { id: toasts?.[0].id } });
      }, 5000);
    }
  }, [toasts, toastDispatch]);

  return (
    <div className={styles.toast}>
      <div className={styles.toastContainer}>
        <div
          className={`${styles.item} ${
            toasts?.[0]?.type ? styles[toasts?.[0].type] : ''
          }`}
        >
          {renderItem(toasts?.[0]?.content)}
        </div>
      </div>
    </div>
  );
}
