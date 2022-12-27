import { useState } from 'react';
import Form from '@/components/forms/Form/Form';
import Input from '@/components/forms/Input/Input';
import Buttons from '@/components/forms/Buttons/Buttons';
import Section from '@/components/forms/Section/Section';
import styles from './AddressForm.module.scss';

function AddressForm({ initialValues, onSubmit, buttonText, title }) {
  const [formValues] = useState({
    address1: initialValues?.address1 || '',
    address2: initialValues?.address2 || '',
    city: initialValues?.city || '',
    company: initialValues?.company || '',
    country: initialValues?.country || '',
    firstName: initialValues?.firstName || '',
    lastName: initialValues?.lastName || '',
    phone: initialValues?.phone || '',
    province: initialValues?.province || '',
    zip: initialValues?.zip || '',
  });

  return (
    <Form onSubmit={onSubmit} initialValues={formValues} title={title}>
      <div>
        <Section>
          <h4 className={styles.title}>Contact Information</h4>
          <Input
            input="true"
            type="text"
            id="firstName"
            name="firstName"
            label="First Name"
          />
          <Input
            input="true"
            type="text"
            id="lastName"
            name="lastName"
            label="Last Name"
          />
          <Input
            input="true"
            type="text"
            id="company"
            name="company"
            label="Company"
          />
          <Input
            input="true"
            type="text"
            id="phone"
            name="phone"
            label="Phone"
          />
        </Section>
        <Section>
          <h4 className={styles.title}>Address</h4>
          <Input
            input="true"
            type="text"
            id="address1"
            name="address1"
            label="Address1"
          />
          <Input
            input="true"
            type="text"
            id="address2"
            name="address2"
            label="Address2"
          />
          <Input input="true" type="text" id="city" name="city" label="City" />
          <Input
            input="true"
            type="text"
            id="country"
            name="country"
            label="Country"
          />
          <Input
            input="true"
            type="text"
            id="province"
            name="province"
            label="Province"
          />
          <Input input="true" type="text" id="zip" name="zip" label="Zip" />
        </Section>
      </div>
      <Buttons text={buttonText} />
    </Form>
  );
}

export default AddressForm;
