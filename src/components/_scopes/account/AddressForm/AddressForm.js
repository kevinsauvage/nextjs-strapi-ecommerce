import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import Form from '@/components/_scopes/forms/Form/Form';
import Input from '@/components/_scopes/forms/Input/Input';
import Row from '@/components/_scopes/forms/Row/Row';

import styles from './AddressForm.module.scss';

function AddressForm({ initialValues, onSubmit, buttonText, title }) {
  const { address1, address2, city, company, lastName, firstName, zip, phone, country, province } =
    initialValues || {};

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
        address1,
        address2,
        city,
        company,
        country,
        firstName,
        lastName,
        phone,
        province,
        zip,
      }}
      title={title}
      requiredFields={['firstName', 'lastName', 'address1', 'province', 'country', 'zip', 'city']}
    >
      <div className={styles.form}>
        <div className={styles.info}>
          <h5 className={styles.title}>Contact Information</h5>
          <Row>
            <Input
              placeholder="First name"
              input="true"
              type="text"
              id="firstName"
              name="firstName"
              label="First Name"
              required="true"
            />
            <Input
              placeholder="Last name"
              input="true"
              type="text"
              id="lastName"
              name="lastName"
              label="Last Name"
              required="true"
            />
          </Row>
          <Row>
            <Input
              placeholder="Company"
              input="true"
              type="text"
              id="company"
              name="company"
              label="Company"
            />
            <Input placeholder="Phone" input="true" type="text" id="phone" name="phone" label="Phone" />
          </Row>
        </div>
        <div>
          <h5 className={styles.title}>Address</h5>
          <Row>
            <Input
              placeholder="Address 1"
              input="true"
              type="text"
              id="address1"
              name="address1"
              label="Address1"
              required="true"
            />
            <Input
              placeholder="Address 2"
              input="true"
              type="text"
              id="address2"
              name="address2"
              label="Address2"
            />
          </Row>
          <Row>
            <Input
              placeholder="City"
              input="true"
              type="text"
              id="city"
              name="city"
              label="City"
              required="true"
            />
            <Input
              placeholder="Province"
              input="true"
              type="text"
              id="province"
              name="province"
              label="Province"
              required="true"
            />
          </Row>
          <Row>
            <Input
              placeholder="Country"
              input="true"
              type="text"
              id="country"
              name="country"
              label="Country"
              required="true"
            />
            <Input
              placeholder="Zip"
              input="true"
              type="text"
              id="zip"
              name="zip"
              label="Zip"
              required="true"
            />
          </Row>
        </div>
      </div>
      <Buttons text={buttonText} />
    </Form>
  );
}

export default AddressForm;
