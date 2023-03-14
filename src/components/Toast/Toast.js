import { useEffect } from 'react';

import styles from './Toast.module.scss';

const ToastItem = ({ tranformY = 0, toast, toastDispatch }) => {
  function renderItem(content) {
    if (typeof content === 'function') return content();
    return <p>{content}</p>;
  }
  useEffect(() => {
    const timeOut = setTimeout(() => {
      toastDispatch({ type: 'REMOVE', payload: { id: toast.id } });
    }, 5000);

    return () => clearTimeout(timeOut);
  }, [toast, toastDispatch]);
  return (
    <div className={styles.toast} style={{ bottom: `${tranformY}px` }}>
      <div className={styles.toastContainer}>
        <div className={`${styles.item} ${toast?.type ? styles[toast?.type] : ''}`}>
          {renderItem(toast?.content)}
        </div>
      </div>
    </div>
  );
};

const Toast = ({ toasts, toastDispatch }) => (
    toasts.length > 0 &&
    toasts.map((toast, i) => (
      <ToastItem key={toast.id} toast={toast} toastDispatch={toastDispatch} tranformY={i * 50} />
    ))
  );

export default Toast;
