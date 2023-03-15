import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
import Form from '@/components/_scopes/forms/Form/Form';
import Input from '@/components/_scopes/forms/Input/Input';
import Row from '@/components/_scopes/forms/Row/Row';

import styles from './AddressForm.module.scss';

const AddressForm = ({ initialValues, onSubmit, buttonText, title }) => {
  const { address1, address2, city, company, lastName, firstName, zip, phone, country, province } =
    initialValues || {};

  return (
    <Form
      extraClass={styles.form}
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
      onSubmit={onSubmit}
      requiredFields={['firstName', 'lastName', 'address1', 'province', 'country', 'zip', 'city']}
      title={title}
    >
      <div>
        <div className={styles.info}>
          <h6 className={styles.title}>Contact Information</h6>
          <Row>
            <Input
              id="firstName"
              input="true"
              label="First Name"
              name="firstName"
              placeholder="First name"
              required="true"
              type="text"
            />
            <Input
              id="lastName"
              input="true"
              label="Last Name"
              name="lastName"
              placeholder="Last name"
              required="true"
              type="text"
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
            />
            <Input id="phone" input="true" label="Phone" name="phone" placeholder="Phone" type="text" />
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
            />
            <Input
              id="address2"
              input="true"
              label="Address2"
              name="address2"
              placeholder="Address 2"
              type="text"
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
            />
            <Input
              id="province"
              input="true"
              label="Province"
              name="province"
              placeholder="Province"
              required="true"
              type="text"
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
            />
            <Input
              id="zip"
              input="true"
              label="Zip"
              name="zip"
              placeholder="Zip"
              required="true"
              type="text"
            />
          </Row>
        </div>
      </div>
      <Buttons text={buttonText} />
    </Form>
  );
};

export default AddressForm;
