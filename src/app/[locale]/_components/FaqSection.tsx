import Link from '@/components/LocalizedLink';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import config from '@/config';
import type { Locale } from '@/i18n/routing';
import { getTranslations } from '@/i18n/server';
import type { FaqSection as FaqSectionData } from '@/lib/server/cmsSections';
import { sanitizeHtmlCached } from '@/utils/sanitize';

import { ArrowRight, MessageCircle } from 'lucide-react';

/**
 * Homepage FAQ accordion. Answers are merchant HTML, so they are sanitized on
 * the server before they reach `dangerouslySetInnerHTML`; the Radix accordion
 * (a client primitive) only owns open/close state.
 */
const FaqSection = async ({ locale, section }: { locale: Locale; section: FaqSectionData }) => {
  const t = getTranslations(locale, 'home');
  const answers = await Promise.all(section.items.map((item) => sanitizeHtmlCached(item.answer)));

  return (
    <section aria-labelledby="home-faq-title" className="py-10 md:py-16">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <span className="text-eyebrow-gold flex items-center gap-3">
            <MessageCircle size={14} aria-hidden="true" />
            {t('faq.eyebrow')}
          </span>
          <h2 id="home-faq-title" className="text-heading-2 mt-3 text-balance">
            {section.title ?? t('faq.title')}
          </h2>
          {section.intro ? (
            <p className="text-body mt-3 max-w-md text-secondary">{section.intro}</p>
          ) : null}
          <div aria-hidden="true" className="rule-gradient mt-5 w-40" />
          <Link
            href={config.routes.contact}
            className="link-underline mt-6 inline-flex items-center gap-2 text-body-sm font-semibold"
          >
            {t('faq.contactCta')}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {section.items.length > 0 ? (
          <div className="lg:col-span-8">
            <Accordion
              type="single"
              collapsible
              className="rounded-[var(--radius)] border border-border/70 bg-card px-5 md:px-7"
            >
              {section.items.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`faq-${index}`}
                  className="border-border/70"
                >
                  <AccordionTrigger className="py-5 text-heading-4 hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    {answers[index] ? (
                      <div
                        className="product-description max-w-none text-secondary"
                        dangerouslySetInnerHTML={{ __html: answers[index] }}
                      />
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default FaqSection;
