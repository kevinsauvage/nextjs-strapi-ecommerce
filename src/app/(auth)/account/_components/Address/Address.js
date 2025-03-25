'use client';

import Link from 'next/link';

import { deleteAddressAction, setDefaultAddressAction } from '@/actions/addressesActions';
import { edit, remove } from '@/assets/svg';
import Tooltip from '@/components/Tooltip/Tooltip';
import config from '@/config';
import { useToastContext } from '@/contexts/ToastContext/NotificationContext';

import style from './Address.module.scss';

const Address = ({ address, isDefault, displayButton = true }) => {
  const { showToast } = useToastContext();

  const { id, address1, address2, name, city, country, province, zip, company, phone } =
    address || {};

  const handleDelete = async () => {
    const response = await deleteAddressAction(id);

    if (response.error) {
      return showToast.error(response.error);
    }
    showToast.success('Address deleted successfully');
  };

  const handleSetAsDefault = async () => {
    const response = await setDefaultAddressAction(id);

    if (response.error) {
      return showToast.error(response.error);
    }
    showToast.success('Address set as default successfully');
  };

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
              <Link className={style.button} href={config.routes.editAddress + '?id=' + id}>
                {edit}
              </Link>
            </Tooltip>
            <Tooltip text="Remove Address">
              <button className={style.button} onClick={handleDelete} type="button">
                {remove}
              </button>
            </Tooltip>
          </div>
        )}

        {!isDefault && displayButton && (
          <button
            className={style['default-button']}
            onClick={() => handleSetAsDefault()}
            type="button"
          >
            Set as default
          </button>
        )}

        {isDefault && <p className={style['default-text']}>Default address</p>}
      </div>
    </div>
  );
};

export default Address;
