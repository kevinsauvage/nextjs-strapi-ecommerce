import Input from '@/components/_scopes/forms/Input/Input';
import Form from '@/components/_scopes/forms/Form/Form';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import TextArea from '@/components/_scopes/forms/TextArea/TextArea';
import FormContainer from '@/components/_scopes/forms/FormContainer/FormContainer';
import PageLayout from '@/layout/PageLayout/PageLayout';

function ContactPage() {
  const onSubmit = async (formData) => {
    if (!formData.email || !formData.name || !formData.message) return null;
    return true;
  };

  return (
    <PageLayout title="Contact Us">
      <FormContainer>
        <Form onSubmit={onSubmit} action="submit" title="Contact Us">
          <Input id="email" label="Email address" name="email" placeholder="Email" required input />
          <Input placeholder="Name" name="name" id="name" label="Name" required input />
          <TextArea placeholder="Message" name="message" id="message" label="Message" required input />
          <Buttons text="SEND MESSAGE" />
        </Form>
      </FormContainer>
    </PageLayout>
  );
}

export default ContactPage;
