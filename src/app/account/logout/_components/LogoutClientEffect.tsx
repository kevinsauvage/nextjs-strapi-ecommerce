'use client';

import { useEffect } from 'react';

import { logoutAction } from '@/actions/usersActions';

const LogoutClientEffect = () => {
  useEffect(() => {
    void logoutAction();
  }, []);

  return <></>;
};

export default LogoutClientEffect;
