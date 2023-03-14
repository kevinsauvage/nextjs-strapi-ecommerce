import { useState } from 'react';

import { edit, remove } from '@/assets/svg';
import Modal from '@/components/_modals/Modal/Modal';
import Tooltip from '@/components/Tooltip/Tooltip';

import AddressForm from '../AddressForm/AddressForm';

import style from './Address.module.scss';

function Address({
  address,
  handleDelete,
  handleSetAsDefault,
  handleUpdateAddress,
  isDefault,
  displayButton = true,
}) {
  const { id, address1, address2, name, city, country, province, zip, company, phone } = address || {};
  const [editAddress, setEditAddress] = useState(false);

  return (
    <div className={style.address}>
      <div className={style.main}>
        <p className={`${style.row} ${style.name}`}>{name}</p>
        <p className={style.row}>
          {address1}, {address2}
        </p>
        <p className={style.row}>
          {zip}, {city}
        </p>
        <p className={style.row}>
          {province}, {country}
        </p>
        <div className={style.row}>
          {company && <p>{company}</p>}
          {phone && <p>{phone}</p>}
        </div>
      </div>

      <div className={style.side}>
        {displayButton ? (
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
        ) : null}

        {!isDefault && displayButton && (
          <button className={style.setAsDefault} onClick={() => handleSetAsDefault(id)} type="button">
            Set as default
          </button>
        )}

        {isDefault && <p className={style.defaultText}>Default address</p>}
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
}

export default Address;
