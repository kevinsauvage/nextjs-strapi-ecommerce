import { useEffect } from 'react';

// eslint-disable-next-line css-modules/no-unused-class
import styles from './Toast.module.scss';

const ToastItem = ({
  transformY = 0,
  toast,
  toastDispatch,
}: {
  transformY?: number;
  toast: { id: string; type: string; content: string | (() => React.ReactNode) };
  toastDispatch: (payload: {
    type: string;
    payload?: {
      id?: string;
      content?: string | (() => React.ReactNode);
      type?: string;
    };
  }) => void;
}) => {
  function renderItem(content: string | (() => React.ReactNode)) {
    if (typeof content === 'function') return content();
    return <p>{content}</p>;
  }
  useEffect(() => {
    const timeOut = setTimeout(() => {
      toastDispatch({ payload: { id: toast.id }, type: 'REMOVE' });
    }, 5000);

    return () => clearTimeout(timeOut);
  }, [toast, toastDispatch]);
  return (
    <div className={styles.toast} style={{ bottom: `${transformY}px` }}>
      <div className={styles.container}>
        <div className={`${styles.item} ${toast?.type ? styles[toast?.type] : ''}`}>
          {renderItem(toast?.content)}
        </div>
      </div>
    </div>
  );
};

const Toast = ({
  toasts,
  toastDispatch,
}: {
  toasts: { id: string; type: string; content: string | (() => React.ReactNode) }[];
  toastDispatch: (payload: {
    type: string;
    payload?: {
      id?: string;
      content?: string | (() => React.ReactNode);
      type?: string;
    };
  }) => void;
}) => {
  return (
    <>
      {toasts.length > 0 &&
        toasts.map((toast, index) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            toastDispatch={toastDispatch}
            transformY={index * 50}
          />
        ))}
    </>
  );
};

export default Toast;
