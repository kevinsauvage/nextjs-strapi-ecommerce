import type * as React from 'react';

import CardHeaderPattern from '@/components/CardHeaderPattern';
import { Card, CardContent } from '@/components/ui/card';
import type { Locale } from '@/i18n/routing';
import { getTranslations } from '@/i18n/server';
import { cn } from '@/utils/cn';

import { ArrowRight, RotateCcw, ShieldCheck, Sparkles, Truck } from 'lucide-react';

type AuthShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  locale: Locale;
};

const BENEFIT_ICONS = [Truck, RotateCcw, ShieldCheck] as const;

const AuthShell = ({ title, description, children, footer, className, locale }: AuthShellProps) => {
  const t = getTranslations(locale, 'auth');
  const benefits = t.raw('benefits') as Array<{ text: string }>;

  return (
    <div className={cn('hero-mesh min-h-[calc(100vh-76px)]', className)}>
      <div className="container mx-auto grid gap-8 px-4 py-10 md:px-6 md:py-14 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="hidden lg:block">
          <span className="text-eyebrow-gold inline-flex items-center gap-2">
            <Sparkles size={14} aria-hidden="true" /> {t('shellEyebrow')}
          </span>
          <h1 className="text-heading-1 mt-4 max-w-md text-balance">{t('shellHeadline')}</h1>
          <ul className="mt-8 space-y-3">
            {benefits.map(({ text }, index) => {
              const Icon = BENEFIT_ICONS[index] ?? ShieldCheck;

              return (
                <li key={text} className="flex items-center gap-3 text-body-sm text-secondary">
                  <span className="flex size-9 items-center justify-center rounded-full border border-border/70 bg-card text-[var(--gold)]">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  {text}
                </li>
              );
            })}
          </ul>
          <p className="mt-8 flex items-center gap-2 text-caption text-secondary">
            {t('shellJoin')} <ArrowRight size={14} aria-hidden="true" />
          </p>
        </div>
        <div className="mx-auto w-full max-w-md">
          <Card className="border-border/60 bg-background/85 shadow-[0_28px_70px_-30px_rgb(12_10_9/0.4)] backdrop-blur supports-backdrop-filter:bg-background/80">
            <CardHeaderPattern
              className="pb-4"
              titleClassName="text-center w-full"
              descriptionClassName="text-center"
              title={title}
              description={description}
              size={3}
            />
            <CardContent className="space-y-6 pt-0">
              {children}
              {footer ? <div className="border-t pt-2">{footer}</div> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
