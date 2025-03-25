'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';

import { updateAddressAction } from '@/actions/addressesActions';
import Form from '@/components/_forms/Form/Form';
import Input from '@/components/_forms/Input/Input';
import Row from '@/components/_forms/Row/Row';
import Button from '@/components/Button/Button';
import config from '@/config';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

import styles from './EditAddressForm.module.scss';

const { userFeedback } = config;

const SubmitButton = () => {
  const status = useFormStatus();
  return <Button type="submit" text={status.pending ? 'Loading...' : 'Edit'} />;
};

const EditAddressForm = ({ address = {} }) => {
  const { showToast } = useToastContext();

  const [states, action] = useActionState(updateAddressAction, address);

  useEffect(() => {
    if (states.error) {
      showToast.error(states.error || userFeedback.login.error);
    }
  }, [showToast, states]);

  return (
    <Form action={action}>
      <div>
        <div className={styles.info}>
          <h6 className={styles.title}>Contact Information</h6>
          <Row>
            <input type="hidden" name="id" defaultValue={states.id} />
            <Input
              id="firstName"
              input="true"
              label="First Name"
              name="firstName"
              placeholder="First name"
              required="true"
              type="text"
              defaultValue={states.firstName}
            />
            <Input
              id="lastName"
              input="true"
              label="Last Name"
              name="lastName"
              placeholder="Last name"
              required="true"
              type="text"
              defaultValue={states.lastName}
            />
          </Row>
          <Row>
            <Input
              id="company"
              input="true"
              label="Company"
              name="company"
              placeholder="Company"
              type="text"
              defaultValue={states.company || ''}
            />
            <Input
              id="phone"
              input="true"
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
              input="true"
              label="Address1"
              name="address1"
              placeholder="Address 1"
              required="true"
              type="text"
              defaultValue={states.address1 || ''}
            />
            <Input
              id="address2"
              input="true"
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
              input="true"
              label="City"
              name="city"
              placeholder="City"
              required="true"
              type="text"
              defaultValue={states.city || ''}
            />
            <Input
              id="province"
              input="true"
              label="Province"
              name="province"
              placeholder="Province"
              required="true"
              type="text"
              defaultValue={states.province || ''}
            />
          </Row>
          <Row>
            <Input
              id="country"
              input="true"
              label="Country"
              name="country"
              placeholder="Country"
              required="true"
              type="text"
              defaultValue={states.country || ''}
            />
            <Input
              id="zip"
              input="true"
              label="Zip"
              name="zip"
              placeholder="Zip"
              required="true"
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
