import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import FormContainer from '@/components/_forms/FormContainer/FormContainer';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import seo from '@/data/seo';

import ContactForm from './_components/ContactForm';

const ContactPage = () => {
  return (
    <div>
      <PageBanner title={seo.pages.contact.title} />
      <Breadcrumbs />
      <FormContainer>
        <ContactForm />
      </FormContainer>
    </div>
  );
};

export default ContactPage;
