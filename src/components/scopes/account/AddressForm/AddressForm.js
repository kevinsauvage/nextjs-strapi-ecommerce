import { useState } from 'react';
import Form from '@/components/forms/Form/Form';
import Button from '@/components/Button/Button';
import styles from './AddressForm.module.scss';

function AddressForm({ initialValues = {}, onSubmit, buttonText }) {
  const [formValues, setFormValues] = useState({
    address1: initialValues.address1 || '',
    address2: initialValues.address2 || '',
    city: initialValues.city || '',
    company: initialValues.company || '',
    country: initialValues.country || '',
    firstName: initialValues.firstName || '',
    lastName: initialValues.lastName || '',
    phone: initialValues.phone || '',
    province: initialValues.province || '',
    zip: initialValues.zip || '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  const style = {
    display: 'grid',
  };

  const getInputs = () =>
    Object.keys(formValues).map((key) => {
      let label = key.replace(/([A-Z])/g, ' $1').trim();
      label = label[0].toUpperCase() + label.substring(1);

      return (
        <div className={styles.container} key={key}>
          <label className={styles.label} htmlFor={key}>
            {label}
          </label>
          <input
            className={styles.input}
            type="text"
            id={key}
            name={key}
            value={formValues[key]}
            onChange={handleChange}
          />
        </div>
      );
    });

  return (
    <Form handleSubmit={handleSubmit}>
      <div style={style}>{getInputs()}</div>
      <Button type="submit" primary text={buttonText} />
    </Form>
  );
}

export default AddressForm;
