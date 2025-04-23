import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import seo from '@/data/seo';

import ContactForm from './_components/ContactForm';

const ContactPage = () => {
  return (
    <div>
      <PageBanner title={seo.pages.contact.title} />
      <Breadcrumbs />
      <ContactForm />
    </div>
  );
};

export default ContactPage;
