import { useRouter } from 'next/router';
import React from 'react';
import CheckoutBtn from '@/components/CheckoutBtn/CheckoutBtn';
import Container from '@/components/Container/Container';
import Form from '@/components/Form/Form';
import Input from '@/components/Input/Input';
import Page from '@/components/Page/Page';
import useForm from '@/hooks/useForm';
import styles from './address.module.scss';

export default function address() {
  const router = useRouter();

  if (router.isFallback) return <div>Loading product...</div>;

  const onSubmit = async (formData) => {
    if (!formData.email || !formData.password) return null;
    return null;
  };

  const { handleInputChange, handleSubmit } = useForm(onSubmit);
  return (
    <Page title="login">
      <Container>
        <div className={styles.login}>
          <Form
            onSubmit={handleSubmit}
            title="ENTER YOUR SHIPPING ADDRESS"
            subtitle="  Please complete the form below to receive your order"
          >
            <Input
              id="address1"
              label="address1"
              name="address1"
              placeholder="address1"
              onChange={handleInputChange}
            />
            <Input
              id="address2"
              label="address2"
              name="address2"
              placeholder="address2"
              onChange={handleInputChange}
            />
            <Input
              placeholder="city"
              name="city"
              id="city"
              label="city"
              onChange={handleInputChange}
            />
            <Input
              placeholder="country"
              name="country"
              id="country"
              label="country"
              onChange={handleInputChange}
            />

            <Input
              placeholder="firstName"
              name="firstName"
              id="firstName"
              label="firstName"
              onChange={handleInputChange}
            />
            <Input
              placeholder="lastName"
              name="lastName"
              id="lastName"
              label="lastName"
              onChange={handleInputChange}
            />

            <Input
              placeholder="phone"
              name="phone"
              id="phone"
              label="phone"
              onChange={handleInputChange}
            />

            <Input
              placeholder="province"
              name="province"
              id="province"
              label="province"
              onChange={handleInputChange}
            />

            <Input
              placeholder="zip"
              name="zip"
              id="zip"
              label="zip"
              onChange={handleInputChange}
            />
            <CheckoutBtn />
          </Form>
        </div>
      </Container>
    </Page>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../locales/${locale}.json`)).default,
    },
  };
}
