'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { updateUserAction } from '@/actions/usersActions';
import Form from '@/components/_forms/Form/Form';
import Input from '@/components/_forms/Input/Input';
import Row from '@/components/_forms/Row/Row';
import Button from '@/components/Button/Button';
import config from '@/config';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';
import useUserContext from '@/contexts/UserContext/useUserContext';
import type { CustomerUserError } from '@/shopify/storefront';

import styles from './UpdateUserForm.module.scss';

const { userFeedback } = config;

const SubmitButton = () => {
  const status = useFormStatus();
  return <Button type="submit" text={status.pending ? 'Loading...' : 'Update'} />;
};

const UpdateUserForm = () => {
  const { user } = useUserContext();
  const { showToast } = useToastContext();
  const [states, action] = useActionState<
    {
      firstName?: string | string[];
      lastName?: string | string[];
      phone?: string | string[];
      acceptsMarketing?: boolean | string[];
      customerUserErrors?: CustomerUserError[];
      error?: string;
      success?: string;
    },
    undefined
  >(updateUserAction, user);
  const [acceptsMarketing, setAcceptsMarketing] = useState(user.acceptsMarketing);

  useEffect(() => {
    if (states?.error) {
      showToast.error(states.error || userFeedback.login.error);
    }

    if (states?.success) {
      showToast.success(states.success || userFeedback.login.success);
    }

    if (states?.customerUserErrors?.length) {
      states.customerUserErrors.forEach((error: CustomerUserError) => {
        showToast.error(error.message || userFeedback.login.error);
      });
    }
  }, [showToast, states, user]);

  return (
    <Form action={action}>
      <Row>
        <Input
          id="firstName"
          type="text"
          label="First Name"
          name="firstName"
          defaultValue={user.firstName}
        />
        <Input
          id="lastName"
          type="text"
          name="lastName"
          label="Last Name"
          defaultValue={user.lastName}
        />
      </Row>
      <Row>
        <Input id="email" type="email" label="Email Address" disabled defaultValue={user.email} />
        <input type="hidden" name="email" value={user.email} />
        <Input id="phone" type="text" name="phone" label="Phone" defaultValue={user.phone} />
      </Row>

      <label htmlFor="acceptsMarketing" className={styles.checkbox}>
        <input
          type="checkbox"
          name="acceptsMarketing"
          defaultChecked={acceptsMarketing}
          onChange={(event) => setAcceptsMarketing(event.target.checked)}
          value={acceptsMarketing ? 'true' : 'false'}
        />
        <p>Check this case to receive our last update</p>
      </label>
      <SubmitButton />
    </Form>
  );
};

export default UpdateUserForm;
