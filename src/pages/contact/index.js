import Head from 'next/head';
import { useRouter } from 'next/router';
import Button from '../../components/Button/Button';
import Container from '../../components/Container/Container';
import Input from '../../components/Input/Input';
import Page from '../../components/Page/Page';
import { messages } from '../../config/i18n';
import useForm from '../../hooks/useForm';
import styles from './Contact.module.scss';

function ContactPage() {
  const router = useRouter();
  if (router.isFallback) return <div>Loading product...</div>;

  const onSubmit = async (formData) => {
    if (!formData.email || !formData.name || !formData.message) return;

    const data = {
      email: formData.email,
      name: formData.name,
      message: formData.message,
    };

    console.log(data);
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page title="Contact Us">
      <Container>
        <div className={styles.contact}>
          <form className={styles.form} onSubmit={handleSubmit} action="submit">
            <h2 className={styles.title}>Get In Touch With Us</h2>
            <h3 className={styles.subtitle}>
              Please complete the form below, we will get back to you shortly.
            </h3>
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
          </form>
        </div>
      </Container>
    </Page>
  );
}

export default ContactPage;

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: messages[locale],
    },
  };
}
