/* eslint-disable sonarjs/no-duplicate-string */
import { useCallback, useEffect, useState } from 'react';

import { getCookieFront, setCookieFront } from '@/helpers/cookies';

import Form from '../_scopes/forms/Form/Form';
import HeightAnimation from '../HeightAnimation/HeightAnimation';

import styles from './CookieBanner.module.scss';

const CookieBanner = () => {
  const [showModal, setShowModal] = useState(false);
  const [consent, setConsent] = useState(true);

  useEffect(() => {
    const hasConsent = getCookieFront('localConsent');
    if (hasConsent) {
      // eslint-disable-next-line no-undef
      gtag('consent', 'update', JSON.parse(hasConsent));
      setConsent(true);
    } else setConsent(false);
  }, []);

  const [settings] = useState({
    functionality_storage: true,
    personalization_storage: true,
    ad_storage: true,
    analytics_storage: true,
  });

  const tranformedSettings = useCallback((originalObject) => {
    const transformedObject = {};

    Object.keys(originalObject).forEach((key) => {
      transformedObject[key] = originalObject[key] ? 'granted' : 'denied';
    });

    return transformedObject;
  }, []);

  const handleSaveSettings = useCallback(
    (formData) => {
      const transformedObject = tranformedSettings(formData);
      // eslint-disable-next-line no-undef
      gtag('consent', 'update', transformedObject);
      setCookieFront('localConsent', JSON.stringify(transformedObject), 365);
      setShowModal(false);
      setConsent(true);
    },
    [tranformedSettings]
  );

  const acceptAllCookie = useCallback(() => {
    const transformedObject = tranformedSettings(settings);
    setCookieFront('localConsent', JSON.stringify(transformedObject), 365);
    // eslint-disable-next-line no-undef
    gtag('consent', 'update', transformedObject);
    setConsent(true);
    setShowModal(false);
  }, [settings, tranformedSettings]);

  if (consent === true) return;

  return (
    <>
      <div className={styles['cookie-banner']}>
        <p>We use cookies to enhance your experience on our website.</p>
        <button type="button" className={styles['accept-btn']} onClick={acceptAllCookie}>
          Accept All
        </button>
        <button type="button" className={styles['settings-btn']} onClick={() => setShowModal(true)}>
          Cookie Settings
        </button>
      </div>
      {showModal && (
        <div className={styles['cookie-settings-modal']}>
          <div className={styles['modal-content']}>
            <h2>Cookie Settings</h2>
            <p className={styles['modal-subtitle']}>
              We use cookies on our website to enhance your browsing experience and to provide you with
              personalized content. We want to give you the option to choose which cookies you allow us to
              use.
            </p>
            <HeightAnimation initialHeight={60} animationType="hover">
              <ul className={`${styles['cookie-list']}`}>
                <li>
                  <strong>Strictly Necessary Cookies:</strong>{' '}
                  <p>
                    These cookies are essential for the website to function properly and cannot be turned off
                    in our system. They are usually set in response to actions made by you which amount to a
                    request for services, such as setting your privacy preferences, logging in, or filling in
                    forms.
                  </p>
                </li>
                <li>
                  <strong>Analytics Cookies:</strong>{' '}
                  <p>
                    These cookies allow us to measure and analyze how our website is being used, in order to
                    improve its performance and your browsing experience.
                  </p>
                </li>
                <li>
                  <strong>Personalized Cookies:</strong>{' '}
                  <p>
                    These cookies are used to personalize your experience on our website by remembering your
                    preferences and settings. They may also be used to provide you with customized content and
                    recommendations based on your activity on our website and other websites.
                  </p>
                </li>
                <li>
                  <strong>Advertising Cookies:</strong>{' '}
                  <p>
                    These cookies are used to make advertising messages more relevant to you and your
                    interests. They are also used to limit the number of times you see an advertisement, as
                    well as to help measure the effectiveness of advertising campaigns.
                  </p>
                </li>
              </ul>
            </HeightAnimation>

            <Form
              onSubmit={handleSaveSettings}
              initialValues={{
                functionality_storage: true,
                personalization_storage: true,
                ad_storage: true,
                analytics_storage: true,
              }}
            >
              <p className={styles['form-title']}>
                <b>Please select which cookies you&apos;d like to allow:</b>
              </p>
              <div className={styles['input-wrapper']}>
                <input
                  type="checkbox"
                  id="functionality_storage"
                  name="functionality_storage"
                  checked
                  disabled
                />
                <label htmlFor="functionality_storage">Strictly Necessary Cookies</label>
              </div>
              <div className={styles['input-wrapper']}>
                <input type="checkbox" id="analytics_storage" name="analytics_storage" />
                <label htmlFor="analytics_storage">Analytics Cookies</label>
              </div>
              <div className={styles['input-wrapper']}>
                <input type="checkbox" id="personalization_storage" name="personalization_storage" />
                <label htmlFor="personalization_storage">Personalization Cookies</label>
              </div>
              <div className={styles['input-wrapper']}>
                <input type="checkbox" id="ad_storage" name="ad_storage" />
                <label htmlFor="ad_storage">Advertising Cookies</label>
              </div>
              <button type="submit" className={styles['save-btn']}>
                Save Settings
              </button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
