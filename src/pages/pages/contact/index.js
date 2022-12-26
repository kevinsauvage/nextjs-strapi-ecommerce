import Button from '@/components/Button/Button';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import useForm from '@/hooks/useForm';
import Form from '@/components/forms/Form/Form';

function ContactPage() {
  const onSubmit = async (formData) => {
    if (!formData.email || !formData.name || !formData.message) return null;
    return true;
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page
      title="Contact Us"
      bannerTitle="Get in touch with us"
      bannerDescription="Welcome to our contact page! We are always here to help with any questions or concerns you may have. Whether you need assistance with an order, have a question about a product, or just want to give us some feedback, we are here to listen. Please don't hesitate to reach out to us through our contact form. We look forward to hearing from you and helping in any way we can. Thank you for choosing us!"
    >
      <Form onSubmit={handleSubmit} action="submit" title="CONTACT US">
        <Input
          id="email"
          label="Email address"
          name="email"
          placeholder="Email"
          onChange={handleInputChange}
          required
        />
        <Input
          placeholder="Name"
          name="name"
          id="name"
          label="Name"
          onChange={handleInputChange}
          required
        />
        <Input
          placeholder="Message"
          textarea
          name="message"
          id="message"
          label="Message"
          onChange={handleInputChange}
          required
        />
        <Button text="SEND MESSAGE" type="submit" tertiary />
      </Form>
    </Page>
  );
}

export default ContactPage;
