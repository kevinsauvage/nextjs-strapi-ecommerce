import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import Form from '@/components/forms/Form/Form';
import Buttons from '@/components/forms/Buttons/Buttons';

function ContactPage() {
  const onSubmit = async (formData) => {
    if (!formData.email || !formData.name || !formData.message) return null;
    return true;
  };

  return (
    <Page title="Contact Us">
      <Form onSubmit={onSubmit} action="submit" title="Contact Us">
        <Input
          id="email"
          label="Email address"
          name="email"
          placeholder="Email"
          required
          input
        />
        <Input placeholder="Name" name="name" id="name" label="Name" required />
        <Input
          placeholder="Message"
          textarea
          name="message"
          id="message"
          label="Message"
          required
          input
        />
        <Buttons text="SEND MESSAGE" />
      </Form>
    </Page>
  );
}

export default ContactPage;
