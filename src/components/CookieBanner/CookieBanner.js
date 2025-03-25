'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import { close } from '@/assets/svg';
import config from '@/config/index';
import { transformedSettings } from '@/utils/consents';
import { getCookieFront, setCookieFront } from '@/utils/cookies';

import ModalCookies from '../_modals/ModalCookies/ModalCookies';

import styles from './CookieBanner.module.scss';

const EXPIRY_COOKIE_TIME = 182;

const CookieBanner = () => {
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const setShowBannerCookies = useCallback((payload) => {
    setShow(payload);
  }, []);

  const setShowModalCookies = useCallback((payload) => {
    setShowModal(payload);
  }, []);

  const handleCookies = useCallback(() => {
    const consent = getCookieFront('localConsent');
    if (consent) window.gtag('consent', 'update', transformedSettings(JSON.parse(consent)));
    else setShow(true);
  }, []);

  useEffect(() => {
    handleCookies();
  }, [handleCookies]);

  const acceptAllCookie = useCallback(() => {
    const cookie = {
      ad_storage: true,
      analytics_storage: true,
      functionality_storage: true,
      personalization_storage: true,
    };
    const transformedObject = transformedSettings(cookie);
    setCookieFront('localConsent', JSON.stringify(cookie), EXPIRY_COOKIE_TIME);
    setShowBannerCookies(false);
    window.gtag('consent', 'update', transformedObject);
    setShowModalCookies(false);
  }, [setShowBannerCookies, setShowModalCookies]);

  const rejectAllCookie = useCallback(() => {
    const cookie = {
      ad_storage: false,
      analytics_storage: false,
      functionality_storage: false,
      personalization_storage: false,
    };
    const transformedObject = transformedSettings(cookie);
    window.gtag('consent', 'update', transformedObject);
    setCookieFront('localConsent', JSON.stringify(cookie), EXPIRY_COOKIE_TIME);
    setShowBannerCookies(false);
    setShowModalCookies(false);
  }, [setShowBannerCookies, setShowModalCookies]);

  return (
    show && (
      <div className={styles['cookie-banner']}>
        <button onClick={() => setShowBannerCookies(false)} type="button" className={styles.close}>
          {close}
        </button>
        <p>
          We use cookies on our website to provide you with a better browsing experience and to help
          us understand how you use our site. By clicking &quot;Accept&quot; you consent to the use
          of cookies as described in our <Link href={config.routes.privacy}>Cookie Policy</Link>. If
          you choose to close this banner without clicking &quot;Accept,&quot; we will assume that
          you do not consent to the use of cookies on our site. Please note that some features of
          our website may not function properly if cookies are not enabled.
        </p>
        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles['reject-btn']} ${styles.btn}`}
            onClick={rejectAllCookie}
          >
            Reject All
          </button>
          <button
            type="button"
            className={`${styles['accept-btn']} ${styles.btn}`}
            onClick={acceptAllCookie}
          >
            Accept All
          </button>
          <button
            type="button"
            className={styles['settings-btn']}
            onClick={() => setShowModalCookies(true)}
          >
            Cookie Settings
          </button>
        </div>
        {showModal && (
          <ModalCookies
            setShowBannerCookies={setShowBannerCookies}
            setShowModalCookies={setShowModalCookies}
          />
        )}
      </div>
    )
  );
};

export default CookieBanner;
