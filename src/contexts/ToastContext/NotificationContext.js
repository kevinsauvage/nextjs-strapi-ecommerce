import React, {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import Toast from '@/components/Toast/Toast';

export const ToastContext = createContext();

const initialState = [];

export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const REMOVE_ALL = 'REMOVE_ALL';

export const toastReducer = (state, action) => {
  switch (action.type) {
    case ADD:
      return [
        ...state,
        {
          id: +new Date(),
          content: action.payload.content,
          type: action.payload.type,
        },
      ];
    case REMOVE:
      return state.filter((t) => t.id !== action.payload.id);
    case REMOVE_ALL:
      return initialState;
    default:
      return state;
  }
};

export function ToastProvider({ children }) {
  const [toasts, toastDispatch] = useReducer(toastReducer, initialState);
  const showToast = useMemo(
    () => ({
      success: (state) => {
        toastDispatch({
          type: 'ADD',
          payload: {
            content: state,
            type: 'success',
          },
        });
      },
      error: (state) => {
        toastDispatch({
          type: 'ADD',
          payload: {
            content: state,
            type: 'error',
          },
        });
      },
      warning: (state) => {
        toastDispatch({
          type: 'ADD',
          payload: {
            content: state,
            type: 'warning',
          },
        });
      },
      info: (state) => {
        toastDispatch({
          type: 'ADD',
          payload: {
            content: state,
            type: 'info',
          },
        });
      },
    }),
    []
  );
  const toastData = useMemo(() => ({ toasts, showToast }), [toasts, showToast]);
  const [mounted, setMounted] = useState();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ToastContext.Provider value={toastData}>
      {children}

      {mounted &&
        toasts.length &&
        createPortal(
          <Toast toasts={toasts} toastDispatch={toastDispatch} />,
          document?.body
        )}
    </ToastContext.Provider>
  );
}

export const useToastContext = () => useContext(ToastContext);
