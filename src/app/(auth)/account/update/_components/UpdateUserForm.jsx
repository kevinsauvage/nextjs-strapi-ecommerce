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

import styles from './UpdateUserForm.module.scss';

const { userFeedback } = config;

const SubmitButton = () => {
  const status = useFormStatus();
  return <Button type="submit" text={status.pending ? 'Loading...' : 'Update'} />;
};

const UpdateUserForm = () => {
  const { user } = useUserContext();
  const { showToast } = useToastContext();
  const [states, action] = useActionState(updateUserAction, user);
  const [acceptsMarketing, setAcceptsMarketing] = useState(user.acceptsMarketing);

  useEffect(() => {
    if (states?.error) {
      showToast.error(states.message || userFeedback.login.error);
    }

    if (states?.success) {
      showToast.success(states.message || userFeedback.login.success);
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
          checkbox="true"
          id="acceptsMarketing"
          type="checkbox"
          name="acceptsMarketing"
          label="Accepts marketing"
          defaultChecked={acceptsMarketing}
          onChange={(event) => setAcceptsMarketing(event.target.checked)}
          value={acceptsMarketing}
        />
        <p>Check this case to receive our last update</p>
      </label>
      <SubmitButton />
    </Form>
  );
};

export default UpdateUserForm;
