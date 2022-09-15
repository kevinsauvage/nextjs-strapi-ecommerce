import { useTranslations } from 'next-intl';
import Button from '@/components/Button/Button';
import Container from '@/components/Container/Container';
import Input from '@/components/Input/Input';
import Page from '@/components/Page/Page';
import useForm from '@/hooks/useForm';
import Form from '@/components/Form/Form';
import styles from './Contact.module.scss';

function ContactPage() {
  const t = useTranslations('page.contact');

  const onSubmit = async (formData) => {
    if (!formData.email || !formData.name || !formData.message) return null;
    return true;
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);

  return (
    <Page title={t('title')}>
      <Container>
        <div className={styles.contact}>
          <Form
            className={styles.form}
            onSubmit={handleSubmit}
            action="submit"
            title={t('form.title')}
            subtitle={t('form.subtitle')}
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

export const getStaticProps = async ({ locale }) => ({
  props: {
    messages: (await import(`../../locales/${locale}.json`)).default,
  },
});
