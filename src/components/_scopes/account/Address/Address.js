import { useState } from 'react';

import { edit, remove } from '@/assets/svg';
import Modal from '@/components/_modals/Modal/Modal';
import Tooltip from '@/components/Tooltip/Tooltip';

import AddressForm from '../AddressForm/AddressForm';

import style from './Address.module.scss';

const Address = ({
  address,
  handleDelete,
  handleSetAsDefault,
  handleUpdateAddress,
  isDefault,
  displayButton = true,
}) => {
  const { id, address1, address2, name, city, country, province, zip, company, phone } = address || {};
  const [editAddress, setEditAddress] = useState(false);

  return (
    <div className={style.address}>
      <div>
        <p>{name}</p>
        <p>
          {address1}, {address2}
        </p>
        <p>
          {zip}, {city}
        </p>
        <p>
          {province}, {country}
        </p>
        <div>
          {company && <p>{company}</p>}
          {phone && <p>{phone}</p>}
        </div>
      </div>

      <div className={style.side}>
        {displayButton && (
          <div className={style.buttons}>
            <Tooltip text="Edit address">
              <button className={style.button} onClick={() => setEditAddress(true)} type="button">
                {edit}
              </button>
            </Tooltip>
            <Tooltip text="Remove Address">
              <button className={style.button} onClick={handleDelete} type="button">
                {remove}
              </button>
            </Tooltip>
          </div>
        )}

        {!isDefault && displayButton && (
          <button className={style['default-button']} onClick={() => handleSetAsDefault(id)} type="button">
            Set as default
          </button>
        )}

        {isDefault && <p className={style['default-text']}>Default address</p>}
      </div>
      {editAddress && (
        <Modal handleClose={() => setEditAddress(false)}>
          <AddressForm
            buttonText="Update Address"
            initialValues={address}
            onSubmit={(formData) => handleUpdateAddress(formData, address.id)}
            title="Update Address"
          />
        </Modal>
      )}
    </div>
  );
};

export default Address;
