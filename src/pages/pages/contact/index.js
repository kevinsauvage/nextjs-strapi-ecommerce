import Button from '@/components/Button/Button';
import Input from '@/components/forms/Input/Input';
import Page from '@/layout/Page/Page';
import useForm from '@/hooks/useForm';
import Form from '@/components/forms/Form/Form';
import styles from './Contact.module.scss';

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
      bannerDescription="Please complete the form below, we will get back to you shortly."
    >
      <div className={styles.contact}>
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
      </div>
    </Page>
  );
}

export default ContactPage;
