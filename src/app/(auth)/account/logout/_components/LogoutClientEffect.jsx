'use client';

import { useEffect } from 'react';

import { logoutAction } from '@/actions/usersActions';

const LogoutClientEffect = () => {
  useEffect(() => {
    logoutAction();
  }, []);

  return <></>;
};

export default LogoutClientEffect;
