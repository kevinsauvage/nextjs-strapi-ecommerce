'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { createPortal } from 'react-dom';

import Toast from './_components/Toast/Toast';

export const ToastContext = createContext<{
  showToast: ShowToast;
  toasts: Toast[];
}>({
  showToast: {
    error: () => {
      // noop
    },
    info: () => {
      // noop
    },
    success: () => {
      // noop
    },
    warning: () => {
      // noop
    },
  },
  toasts: [],
});

const initialState: ToastState = [];

export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const REMOVE_ALL = 'REMOVE_ALL';

type ToastType = 'error' | 'info' | 'success' | 'warning';
type Toast = {
  content: string;
  id: string;
  type: ToastType;
};
type ToastState = Toast[];
type ToastAction = {
  type: string;
  payload: {
    content?: string;
    type?: ToastType;
    id?: string;
  };
};
type ToastReducer = (state: ToastState, action: ToastAction) => ToastState;
type ToastProviderProperties = {
  children: React.ReactNode;
};
type ShowToast = {
  error: (state: string) => void;
  info: (state: string) => void;
  success: (state: string) => void;
  warning: (state: string) => void;
};

export const toastReducer: ToastReducer = (state, action) => {
  switch (action.type) {
    case ADD: {
      return [
        ...state,
        {
          content: action.payload.content,
          id: Date.now().toString(),
          type: action.payload.type,
        },
      ];
    }
    case REMOVE: {
      return state.filter((t) => t.id !== action.payload.id);
    }
    case REMOVE_ALL: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export const ToastProvider: React.FC<ToastProviderProperties> = ({ children }) => {
  const [toasts, toastDispatch] = useReducer(toastReducer, initialState);
  const [mounted, setMounted] = useState(false);

  const showToast: ShowToast = useMemo(
    () => ({
      error: (state) => {
        toastDispatch({
          payload: {
            content: state,
            type: 'error',
          },
          type: ADD,
        });
      },
      info: (state) => {
        toastDispatch({
          payload: {
            content: state,
            type: 'info',
          },
          type: ADD,
        });
      },
      success: (state) => {
        toastDispatch({
          payload: {
            content: state,
            type: 'success',
          },
          type: ADD,
        });
      },
      warning: (state) => {
        toastDispatch({
          payload: {
            content: state,
            type: 'warning',
          },
          type: ADD,
        });
      },
    }),
    [],
  );

  const toastData = useMemo(() => ({ showToast, toasts }), [toasts, showToast]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ToastContext.Provider value={toastData}>
      {children}
      {mounted &&
        toasts.length > 0 &&
        createPortal(<Toast toasts={toasts} toastDispatch={toastDispatch} />, document?.body)}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
