'use client';

import { useCallback } from 'react';

import Form from '@/components/_forms/Form/Form';
import Flexbox from '@/components/Flexbox/Flexbox';
import HeightAnimation from '@/components/HeightAnimation/HeightAnimation';
import { transformedSettings } from '@/utils/consents';
import { setCookieFront } from '@/utils/cookies';

import Modal from '../Modal/Modal';

import styles from './ModalCookies.module.scss';

const EXPIRY_COOKIE_TIME = 182;

const ModalCookies = ({
  setShowBannerCookies,
  setShowModalCookies,
}: {
  setShowBannerCookies: (show: boolean) => void;
  setShowModalCookies: (show: boolean) => void;
}) => {
  const handleSaveSettings = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const target = event.currentTarget;
      const formData = {
        ad_storage: (target.elements.namedItem('ad_storage') as HTMLInputElement).checked,
        analytics_storage: (target.elements.namedItem('analytics_storage') as HTMLInputElement)
          .checked,
        functionality_storage: (
          target.elements.namedItem('functionality_storage') as HTMLInputElement
        ).checked,
        personalization_storage: (
          target.elements.namedItem('personalization_storage') as HTMLInputElement
        ).checked,
      };

      const transformedObject = transformedSettings(formData);

      window.gtag('consent', 'update', transformedObject);
      setCookieFront('localConsent', JSON.stringify(formData), EXPIRY_COOKIE_TIME);
      setShowModalCookies(false);
      setShowBannerCookies(false);
    },
    [setShowBannerCookies, setShowModalCookies],
  );

  return (
    <Modal handleClose={() => setShowModalCookies(false)} loading={false}>
      <div className={styles['cookie-settings-modal']}>
        <h2>Cookie Settings</h2>
        <p className={styles['modal-subtitle']}>
          We use cookies on our website to enhance your browsing experience and to provide you with
          personalized content. We want to give you the option to choose which cookies you allow us
          to use.
        </p>
        <HeightAnimation initialHeight={60} animationType="button">
          <ul className={`${styles['cookie-list']}`}>
            <li>
              <strong>Strictly Necessary Cookies:</strong>{' '}
              <p>
                These cookies are essential for the website to function properly and cannot be
                turned off in our system. They are usually set in response to actions made by you
                which amount to a request for services, such as setting your privacy preferences,
                logging in, or filling in forms.
              </p>
            </li>
            <li>
              <strong>Analytics Cookies:</strong>{' '}
              <p>
                These cookies allow us to measure and analyze how our website is being used, in
                order to improve its performance and your browsing experience.
              </p>
            </li>
            <li>
              <strong>Personalized Cookies:</strong>{' '}
              <p>
                These cookies are used to personalize your experience on our website by remembering
                your preferences and settings. They may also be used to provide you with customized
                content and recommendations based on your activity on our website and other
                websites.
              </p>
            </li>
            <li>
              <strong>Advertising Cookies:</strong>{' '}
              <p>
                These cookies are used to make advertising messages more relevant to you and your
                interests. They are also used to limit the number of times you see an advertisement,
                as well as to help measure the effectiveness of advertising campaigns.
              </p>
            </li>
          </ul>
        </HeightAnimation>

        <Form onSubmit={handleSaveSettings}>
          <p className={styles['form-title']}>
            <b>Please select which cookies you&apos;d like to allow:</b>
          </p>
          <Flexbox>
            <input type="checkbox" id="functionality_storage" name="functionality_storage" />
            <label htmlFor="functionality_storage">Strictly Necessary Cookies</label>
          </Flexbox>
          <Flexbox>
            <input type="checkbox" id="analytics_storage" name="analytics_storage" />
            <label htmlFor="analytics_storage">Analytics Cookies</label>
          </Flexbox>
          <Flexbox>
            <input type="checkbox" id="personalization_storage" name="personalization_storage" />
            <label htmlFor="personalization_storage">Personalization Cookies</label>
          </Flexbox>
          <Flexbox>
            <input type="checkbox" id="ad_storage" name="ad_storage" />
            <label htmlFor="ad_storage">Advertising Cookies</label>
          </Flexbox>
          <button type="submit" className={styles['save-btn']}>
            Save Settings
          </button>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalCookies;
