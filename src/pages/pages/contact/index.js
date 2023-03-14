import PageBanner from '@/components/_banners/PageBanner/PageBanner';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import Form from '@/components/_scopes/forms/Form/Form';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import Input from '@/components/_scopes/forms/Input/Input';
import TextArea from '@/components/_scopes/forms/TextArea/TextArea';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import seo from '@/data/seo';
import { sendMail } from '@/helpers/apiNext';
import PageLayout from '@/layout/PageLayout/PageLayout';

const ContactPage = () => {
  const { toggleLoading } = useGlobalContext();
  const { showToast } = useToastContext();

  const onSubmit = async (formData) => {
    const { email, name, message } = formData || {};
    if (!email || !name || !message) return;

    toggleLoading(true);
    const res = await sendMail({ email, name, message });
    toggleLoading(false);

    if (res?.ok) {
      const elements = document.querySelectorAll('input, textarea');
      elements.forEach((e) => {
        e.value = '';
      });

      showToast.success('Message sent successfully');
      return;
    }
    showToast.error('Something went wrong, please try again');
  };

  return (
    <PageLayout title={seo.pages.contact.title} description={seo.pages.contact.description}>
      <PageBanner title={seo.pages.contact.title} />
      <Breadcrumbs />
      <FormContainer>
        <Form
          onSubmit={onSubmit}
          action="submit"
          title={seo.pages.contact.title}
          initialValues={[{ email: '', name: '', message: '' }]}
          requiredFields={['email', 'name', 'message']}
        >
          <Input
            id="email"
            label="Email address"
            name="email"
            placeholder="Email"
            input="true"
            required="true"
          />
          <Input placeholder="Name" name="name" id="name" label="Name" input="true" required="true" />
          <TextArea
            placeholder="Message"
            name="message"
            id="message"
            label="Message"
            input="true"
            required="true"
          />
          <Buttons text="SEND MESSAGE" />
        </Form>
      </FormContainer>
    </PageLayout>
  );
};

export default ContactPage;
