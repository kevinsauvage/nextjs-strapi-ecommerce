'use client';

import { useEffect } from 'react';

import { logoutAction } from '@/actions/usersActions';

const LogoutClientEffect = () => {
  useEffect(() => {
    // This is a client action, so we can call it directly
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    logoutAction();
  }, []);

  return <></>;
};

export default LogoutClientEffect;
