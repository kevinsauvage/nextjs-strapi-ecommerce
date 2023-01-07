import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import Form from '@/components/forms/Form/Form';
import Buttons from '@/components/forms/Buttons/Buttons';
import TextArea from '@/components/forms/TextArea/TextArea';

function ContactPage() {
  const onSubmit = async (formData) => {
    console.log(formData);
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
        <Input
          placeholder="Name"
          name="name"
          id="name"
          label="Name"
          required
          input
        />
        <TextArea
          placeholder="Message"
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
