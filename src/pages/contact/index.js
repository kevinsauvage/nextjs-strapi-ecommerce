import Button from '@/components/Button/Button';
import Container from '@/layout/Container/Container';
import Input from '@/components/Input/Input';
import Page from '@/layout/Page/Page';
import useForm from '@/hooks/useForm';
import Form from '@/components/Form/Form';
import styles from './Contact.module.scss';

function ContactPage() {
  const onSubmit = async (formData) => {
    if (!formData.email || !formData.name || !formData.message) return null;
    return true;
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page title="Contact Us">
      <Container>
        <div className={styles.contact}>
          <Form
            className={styles.form}
            onSubmit={handleSubmit}
            action="submit"
            title="GET IN TOUCH WITH US"
            subtitle="Please complete the form below, we will get back to you shortly."
          >
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
      </Container>
    </Page>
  );
}

export default ContactPage;
