import Breadcrumbs from '@/components/Breadcrumbs';
import PageBanner from '@/components/PageBanner';
import seo from '@/data/seo';

import ContactForm from './_components/ContactForm';

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
