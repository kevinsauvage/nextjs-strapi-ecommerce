'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import type { MailingAddress } from '@/shopify/storefront';

import { updateAddressAction } from '@/actions/addressesActions';
import Form from '@/components/_forms/Form/Form';
import Input from '@/components/_forms/Input/Input';
import Row from '@/components/_forms/Row/Row';
import Button from '@/components/Button/Button';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

import styles from './EditAddressForm.module.scss';

const SubmitButton = () => {
  const status = useFormStatus();
  return <Button type="submit" text={status.pending ? 'Loading...' : 'Edit'} />;
};

const EditAddressForm = ({ address }: { address: MailingAddress | undefined }) => {
  const { showToast } = useToastContext();

  const [states, action] = useActionState<
    {
      id?: string | string[];
      firstName?: string | string[];
      lastName?: string | string[];
      company?: string | string[];
      phone?: string | string[];
      address1?: string | string[];
      address2?: string | string[];
      city?: string | string[];
      province?: string | string[];
      country?: string | string[];
      zip?: string | string[];
      customerUserErrors?: { message?: string }[];
      error?: string;
    },
    undefined
  >(updateAddressAction, address || {});

  useEffect(() => {
    if (states.customerUserErrors?.length) {
      states.customerUserErrors.forEach((error) => {
        if (error?.message) {
          showToast.error(error.message);
        }
      });
    }

    if (states.error) {
      showToast.error(states.error);
    }
  }, [showToast, states]);

  return (
    <Form action={action}>
      <div>
        <div className={styles.info}>
          <h6 className={styles.title}>Contact Information</h6>
          <Row>
            <input type="hidden" name="id" defaultValue={states?.id} />
            <Input
              id="firstName"
              label="First Name"
              name="firstName"
              placeholder="First name"
              required={true}
              type="text"
              defaultValue={states?.firstName}
            />
            <Input
              id="lastName"
              label="Last Name"
              name="lastName"
              placeholder="Last name"
              required={true}
              type="text"
              defaultValue={states?.lastName}
            />
          </Row>
          <Row>
            <Input
              id="company"
              label="Company"
              name="company"
              placeholder="Company"
              type="text"
              defaultValue={states.company || ''}
            />
            <Input
              id="phone"
              label="Phone"
              name="phone"
              placeholder="Phone"
              type="text"
              defaultValue={states.phone || ''}
            />
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
              defaultValue={states.address1 || ''}
            />
            <Input
              id="address2"
              label="Address2"
              name="address2"
              placeholder="Address 2"
              type="text"
              defaultValue={states.address2 || ''}
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
              defaultValue={states.city || ''}
            />
            <Input
              id="province"
              label="Province"
              name="province"
              placeholder="Province"
              required={true}
              type="text"
              defaultValue={states.province || ''}
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
              defaultValue={states.country || ''}
            />
            <Input
              id="zip"
              label="Zip"
              name="zip"
              placeholder="Zip"
              required={true}
              type="text"
              defaultValue={states.zip || ''}
            />
          </Row>
        </div>
      </div>
      <SubmitButton />
    </Form>
  );
};

export default EditAddressForm;
