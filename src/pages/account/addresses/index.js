import useUserContext from '@/contexts/UserContext/useUserContext';
import Page from '@/layout/Page/Page';
import Address from '@/components/scopes/account/Address/Address';
import Card from '@/components/scopes/account/Card/Card';
import Modal from '@/layout/Modal/Modal';
import React, { useState } from 'react';
import nextApiCall from '@/utils/apiNext';
import styles from './Addresses.module.scss';

function AddressForm({ initialValues, onSubmit }) {
  const [formValues, setFormValues] = useState({
    address1: initialValues.address1,
    address2: initialValues.address2,
    city: initialValues.city,
    company: initialValues.company,
    country: initialValues.country,
    firstName: initialValues.firstName,
    lastName: initialValues.lastName,
    phone: initialValues.phone,
    province: initialValues.province,
    zip: initialValues.zip,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstName">First Name:</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={formValues.firstName}
        onChange={handleChange}
      />

      <br />
      <label htmlFor="lastName">Last Name:</label>
      <input
        type="text"
        id="lastName"
        name="lastName"
        value={formValues.lastName}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="address1">Address Line 1:</label>
      <input
        type="text"
        id="address1"
        name="address1"
        value={formValues.address1}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="address2">Address Line 2:</label>
      <input
        type="text"
        id="address2"
        name="address2"
        value={formValues.address2}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="city">City:</label>
      <input
        type="text"
        id="city"
        name="city"
        value={formValues.city}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="province">Province/State:</label>
      <input
        type="text"
        id="province"
        name="province"
        value={formValues.province}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="zip">Zip/Postal Code:</label>
      <input
        type="text"
        id="zip"
        name="zip"
        value={formValues.zip}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="country">Country:</label>
      <input
        type="text"
        id="country"
        name="country"
        value={formValues.country}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="company">Company:</label>
      <input
        type="text"
        id="company"
        name="company"
        value={formValues.company}
        onChange={handleChange}
      />
      <br />
      <label htmlFor="phone">Phone:</label>
      <input
        type="text"
        id="phone"
        name="phone"
        value={formValues.phone}
        onChange={handleChange}
      />
      <br />

      <button type="submit">Update</button>
    </form>
  );
}

function Addresses() {
  const { user } = useUserContext();
  const { addresses } = user || {};
  const [selected, setSelected] = useState(undefined);

  const handleClickAddress = (address) => setSelected(address);

  const handleSubmit = async (formData) => {
    const res = await nextApiCall.updateAddress({
      address: formData,
      id: selected.id,
    });
    console.log('🚀 ~ file: index.js:146 ~ handleSubmit ~ res', res);
  };

  return (
    <Page>
      {selected && (
        <Modal>
          <AddressForm initialValues={selected} onSubmit={handleSubmit} />
        </Modal>
      )}
      <div className={styles.addresses}>
        <h1 className={styles.title}>Address List</h1>
        <p className={styles.subtitle}>Here is a list of all your addresses:</p>
        {Array.isArray(addresses) && addresses.length > 0 ? (
          <div className={styles.list}>
            {addresses.map((item) => (
              <Card key={item.id}>
                <Address
                  address={item}
                  handleClick={handleClickAddress}
                  buttonText="Edit"
                />
              </Card>
            ))}
          </div>
        ) : (
          <p className={styles.noAddresses}>There is no addresses to show</p>
        )}
      </div>
    </Page>
  );
}

export default Addresses;
