import Form from '@/components/forms/Form/Form';
import Input from '@/components/forms/Input/Input';
import Buttons from '@/components/forms/Buttons/Buttons';
import Section from '@/components/forms/Section/Section';
import Row from '@/components/forms/Row/Row';
import styles from './AddressForm.module.scss';

function AddressForm({ initialValues, onSubmit, buttonText, title }) {
  const {
    address1,
    address2,
    city,
    company,
    lastName,
    firstName,
    zip,
    phone,
    country,
    province,
  } = initialValues || {};

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
        <Section>
          <h4 className={styles.title}>Contact Information</h4>
          <Row>
            <Input
              input="true"
              type="text"
              id="firstName"
              name="firstName"
              label="First Name"
              required
            />
            <Input
              input="true"
              type="text"
              id="lastName"
              name="lastName"
              label="Last Name"
              required
            />
          </Row>
          <Row>
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
          </Row>
        </Section>
        <Section>
          <h4 className={styles.title}>Address</h4>
          <Row>
            <Input
              input="true"
              type="text"
              id="address1"
              name="address1"
              label="Address1"
              required
            />
            <Input
              input="true"
              type="text"
              id="address2"
              name="address2"
              label="Address2"
            />
          </Row>
          <Row>
            <Input
              input="true"
              type="text"
              id="city"
              name="city"
              label="City"
              required
            />
            <Input
              input="true"
              type="text"
              id="province"
              name="province"
              label="Province"
              required
            />
          </Row>
          <Row>
            <Input
              input="true"
              type="text"
              id="country"
              name="country"
              label="Country"
              required
            />
            <Input
              input="true"
              type="text"
              id="zip"
              name="zip"
              label="Zip"
              required
            />
          </Row>
        </Section>
      </div>
      <Buttons text={buttonText} />
    </Form>
  );
}

export default AddressForm;
