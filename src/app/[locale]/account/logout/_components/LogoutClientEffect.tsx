'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

import { logoutAction } from '@/actions/authActions';

/**
 * Submits the logout server action on mount. Using a form action lets Next.js
 * handle the redirect from the server action natively.
 */
const LogoutClientEffect = () => {
  const t = useTranslations('account');
  const formReference = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formReference.current?.requestSubmit();
  }, []);

  // The effect auto-submits for JS users; the `<noscript>` button keeps the
  // logout usable with JS disabled.
  return (
    <form ref={formReference} action={logoutAction}>
      <noscript>
        <button type="submit">{t('logout')}</button>
      </noscript>
    </form>
  );
};

export default LogoutClientEffect;
