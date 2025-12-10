import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';
import { generateMetadata as generateMetadataUtil } from '@/utils/metadata';

import ContactForm from './_components/ContactForm';

export const metadata: Metadata = generateMetadataUtil({
  title: seo.pages.contact.title,
  description: seo.pages.contact.description,
  url: '/contact',
});

const ContactPage = () => {
  const { title, description } = seo.pages.contact || {};
  return (
    <div>
      <PageBanner title={title} description={description}>
        <Breadcrumbs />
      </PageBanner>
      <ContactForm />
    </div>
  );
};

export default ContactPage;
