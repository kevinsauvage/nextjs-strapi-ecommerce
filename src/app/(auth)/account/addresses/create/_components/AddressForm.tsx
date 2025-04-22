'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import type { CustomerUserError } from '@/shopify/storefront';

import { createAddressAction } from '@/actions/addressesActions';
import Form from '@/components/_forms/Form/Form';
import Input from '@/components/_forms/Input/Input';
import Row from '@/components/_forms/Row/Row';
import Button from '@/components/Button/Button';
import config from '@/config';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

import styles from './AddressForm.module.scss';

const { userFeedback } = config;

const SubmitButton = () => {
  const status = useFormStatus();
  return <Button type="submit" text={status.pending ? 'Loading...' : 'Create'} />;
};

const AddressForm = () => {
  const { showToast } = useToastContext();

  const [states, action] = useActionState<
    {
      address1?: string | string[];
      address2?: string | string[];
      city?: string | string[];
      company?: string | string[];
      country?: string | string[];
      customerUserErrors?: CustomerUserError[];
      error?: string;
      firstName?: string | string[];
      id?: string | string[];
      lastName?: string | string[];
      phone?: string | string[];
      province?: string | string[];
      zip?: string | string[];
    },
    undefined
  >(createAddressAction, {});

  useEffect(() => {
    if (states.error) {
      showToast.error(states.error || userFeedback.login.error);
    }

    if (states.customerUserErrors?.length) {
      states.customerUserErrors.forEach((error: CustomerUserError) => {
        showToast.error(error.message || userFeedback.login.error);
      });
    }
  }, [showToast, states]);

  return (
    <Form action={action}>
      <div>
        <div className={styles.info}>
          <h6 className={styles.title}>Contact Information</h6>
          <Row>
            <Input
              id="firstName"
              label="First Name"
              name="firstName"
              placeholder="First name"
              required={true}
              type="text"
            />
            <Input
              id="lastName"
              label="Last Name"
              name="lastName"
              placeholder="Last name"
              required={true}
              type="text"
            />
          </Row>
          <Row>
            <Input id="company" label="Company" name="company" placeholder="Company" type="text" />
            <Input id="phone" label="Phone" name="phone" placeholder="Phone" type="text" />
          </Row>
        </div>
        <div>
          <h6 className={styles.title}>Address</h6>
          <Row>
            <Input
              id="address1"
              label="Address1"
              name="address1"
              placeholder="Address 1"
              required={true}
              type="text"
            />
            <Input
              id="address2"
              label="Address2"
              name="address2"
              placeholder="Address 2"
              type="text"
            />
          </Row>
          <Row>
            <Input
              id="city"
              label="City"
              name="city"
              placeholder="City"
              required={true}
              type="text"
            />
            <Input
              id="province"
              label="Province"
              name="province"
              placeholder="Province"
              required={true}
              type="text"
            />
          </Row>
          <Row>
            <Input
              id="country"
              label="Country"
              name="country"
              placeholder="Country"
              required={true}
              type="text"
            />
            <Input id="zip" label="Zip" name="zip" placeholder="Zip" required={true} type="text" />
          </Row>
        </div>
      </div>
      <SubmitButton />
    </Form>
  );
};

export default AddressForm;
