'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { createPortal } from 'react-dom';

import Toast from '@/components/Toast/Toast';

export const ToastContext = createContext();

const initialState = [];

export const ADD = 'ADD';
export const REMOVE = 'REMOVE';
export const REMOVE_ALL = 'REMOVE_ALL';

export const toastReducer = (state, action) => {
  switch (action.type) {
    case ADD: {
      return [
        ...state,
        {
          content: action.payload.content,
          id: Date.now(),
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

export const ToastProvider = ({ children }) => {
  const [toasts, toastDispatch] = useReducer(toastReducer, initialState);
  const [mounted, setMounted] = useState();

  const showToast = useMemo(
    () => ({
      error: (state) => {
        toastDispatch({
          payload: {
            content: state,
            type: 'error',
          },
          type: 'ADD',
        });
      },
      info: (state) => {
        toastDispatch({
          payload: {
            content: state,
            type: 'info',
          },
          type: 'ADD',
        });
      },
      success: (state) => {
        toastDispatch({
          payload: {
            content: state,
            type: 'success',
          },
          type: 'ADD',
        });
      },
      warning: (state) => {
        toastDispatch({
          payload: {
            content: state,
            type: 'warning',
          },
          type: 'ADD',
        });
      },
    }),
    []
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
