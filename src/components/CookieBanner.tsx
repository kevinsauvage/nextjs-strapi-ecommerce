'use client';

import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import config from '@/config';
import { withGtag } from '@/utils/analytics';
import type { originalSettingsType } from '@/utils/consents';
import { transformedSettings } from '@/utils/consents';
import { getCookieFront, setCookieFront } from '@/utils/cookies';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';

const EXPIRY_COOKIE_TIME = config.constants.cookieExpiryDays;

const CookieBanner = () => {
  const [show, setShow] = useState<boolean | undefined>(false);

  const setShowBannerCookies = useCallback((payload: boolean) => {
    setShow(payload);
  }, []);

  const handleCookies = useCallback(() => {
    const consent = getCookieFront('localConsent');
    if (consent && typeof consent === 'string') {
      withGtag((gtag) => {
        gtag('consent', 'update', transformedSettings(JSON.parse(consent) as originalSettingsType));
      });
    } else setShow(true);
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
    withGtag((gtag) => {
      gtag('consent', 'update', transformedObject);
    });
  }, [setShowBannerCookies]);

  const rejectAllCookie = useCallback(() => {
    const cookie = {
      ad_storage: false,
      analytics_storage: false,
      functionality_storage: false,
      personalization_storage: false,
    };
    const transformedObject = transformedSettings(cookie);
    withGtag((gtag) => {
      gtag('consent', 'update', transformedObject);
    });
    setCookieFront('localConsent', JSON.stringify(cookie), EXPIRY_COOKIE_TIME);
    setShowBannerCookies(false);
  }, [setShowBannerCookies]);

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

      withGtag((gtag) => {
        gtag('consent', 'update', transformedObject);
      });
      setCookieFront('localConsent', JSON.stringify(formData), EXPIRY_COOKIE_TIME);
      setShowBannerCookies(false);
    },
    [setShowBannerCookies],
  );
  return (
    show && (
      <Sheet open={show}>
        <SheetContent side="bottom">
          <VisuallyHidden.Root>
            <SheetHeader>
              <SheetTitle>Cookie Consent</SheetTitle>
              <SheetDescription>Manage your cookie preferences for this website.</SheetDescription>
            </SheetHeader>
          </VisuallyHidden.Root>
          <div className="fixed bottom-0 left-0 w-full p-3 z-50 bg-background flex flex-col gap-3 border-t">
            <Button onClick={() => setShowBannerCookies(false)} type="button" size="icon">
              <X />
            </Button>
            <p className="text-body text-secondary">
              We use cookies on our website to provide you with a better browsing experience and to
              help us understand how you use our site. By clicking &quot;Accept&quot; you consent to
              the use of cookies as described in our{' '}
              <Link href={config.routes.privacy} className="text-accent hover:underline">Cookie Policy</Link>. If you choose to close this
              banner without clicking &quot;Accept,&quot; we will assume that you do not consent to
              the use of cookies on our site. Please note that some features of our website may not
              function properly if cookies are not enabled.
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="destructive"
                type="button"
                className=""
                onClick={rejectAllCookie}
              >
                Reject All
              </Button>
              <Button type="button" variant="outline" onClick={acceptAllCookie}>
                Accept All
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Cookie Settings</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Cookie Settings</DialogTitle>
                    <DialogDescription>
                      We use cookies on our website to enhance your browsing experience and to
                      provide you with personalized content. We want to give you the option to
                      choose which cookies you allow us to use.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="border p-4 max-h-36 overflow-scroll ">
                    <ul className="block text-body-sm">
                      <li className="mb-3">
                        <strong className="text-body font-semibold">Strictly Necessary Cookies:</strong>{' '}
                        <p className="text-body-sm text-secondary">
                          These cookies are essential for the website to function properly and
                          cannot be turned off in our system. They are usually set in response to
                          actions made by you which amount to a request for services, such as
                          setting your privacy preferences, logging in, or filling in forms.
                        </p>
                      </li>
                      <li className="mb-3">
                        <strong className="text-body font-semibold">Analytics Cookies:</strong>{' '}
                        <p className="text-body-sm text-secondary">
                          These cookies allow us to measure and analyze how our website is being
                          used, in order to improve its performance and your browsing experience.
                        </p>
                      </li>
                      <li className="mb-3">
                        <strong className="text-body font-semibold">Personalized Cookies:</strong>{' '}
                        <p className="text-body-sm text-secondary">
                          These cookies are used to personalize your experience on our website by
                          remembering your preferences and settings. They may also be used to
                          provide you with customized content and recommendations based on your
                          activity on our website and other websites.
                        </p>
                      </li>
                      <li className="mb-3">
                        <strong className="text-body font-semibold">Advertising Cookies:</strong>{' '}
                        <p className="text-body-sm text-secondary">
                          These cookies are used to make advertising messages more relevant to you
                          and your interests. They are also used to limit the number of times you
                          see an advertisement, as well as to help measure the effectiveness of
                          advertising campaigns.
                        </p>
                      </li>
                    </ul>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-3">
                    <p className="text-heading-4">
                      <b>Please select which cookies you&apos;d like to allow:</b>
                    </p>
                    <div className="space-y-0.5">
                      <div className="flex gap-1.5">
                        <Input
                          type="checkbox"
                          id="functionality_storage"
                          name="functionality_storage"
                          className="w-fit"
                        />
                        <Label htmlFor="functionality_storage">Strictly Necessary Cookies</Label>
                      </div>
                      <div className="flex gap-1.5">
                        <Input
                          type="checkbox"
                          id="analytics_storage"
                          name="analytics_storage"
                          className="w-fit"
                        />
                        <Label htmlFor="analytics_storage">Analytics Cookies</Label>
                      </div>
                      <div className="flex gap-1.5">
                        <Input
                          className="w-fit"
                          type="checkbox"
                          id="personalization_storage"
                          name="personalization_storage"
                        />
                        <Label htmlFor="personalization_storage">Personalization Cookies</Label>
                      </div>
                      <div className="flex gap-1.5">
                        <Input
                          type="checkbox"
                          id="ad_storage"
                          name="ad_storage"
                          className="w-fit"
                        />
                        <Label htmlFor="ad_storage">Advertising Cookies</Label>
                      </div>
                    </div>
                    <Button type="submit" variant="secondary">
                      Save Settings
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  );
};

export default CookieBanner;
