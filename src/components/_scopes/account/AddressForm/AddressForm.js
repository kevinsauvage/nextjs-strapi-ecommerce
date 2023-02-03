import Form from '@/components/_scopes/forms/Form/Form';
import Input from '@/components/_scopes/forms/Input/Input';
import Buttons from '@/components/_scopes/forms/Buttons/Buttons';
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
    >
      <div>
        <div className={styles.info}>
          <h4 className={styles.title}>Contact Information</h4>
          <Row>
            <Input input="true" type="text" id="firstName" name="firstName" label="First Name" required />
            <Input input="true" type="text" id="lastName" name="lastName" label="Last Name" required />
          </Row>
          <Row>
            <Input input="true" type="text" id="company" name="company" label="Company" />
            <Input input="true" type="text" id="phone" name="phone" label="Phone" />
          </Row>
        </div>
        <div>
          <h4 className={styles.title}>Address</h4>
          <Row>
            <Input input="true" type="text" id="address1" name="address1" label="Address1" required />
            <Input input="true" type="text" id="address2" name="address2" label="Address2" />
          </Row>
          <Row>
            <Input input="true" type="text" id="city" name="city" label="City" required />
            <Input input="true" type="text" id="province" name="province" label="Province" required />
          </Row>
          <Row>
            <Input input="true" type="text" id="country" name="country" label="Country" required />
            <Input input="true" type="text" id="zip" name="zip" label="Zip" required />
          </Row>
        </div>
      </div>
      <Buttons text={buttonText} />
    </Form>
  );
}

export default AddressForm;
