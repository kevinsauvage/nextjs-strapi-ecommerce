import Link from 'next/link';
import config from '@/config/index';
import Tooltip from '@/components/Tooltip/Tooltip';
import { edit, remove } from '@/assets/svg';
import style from './Address.module.scss';

function Address({ address, handleDelete, handleSetAsDefault, isDefault, displayButton = true }) {
  const { id, address1, address2, name, city, country, province, zip, company, phone } = address || {};

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
              <Link
                className={style.button}
                href={`${config.routes.updateAddress}/${encodeURIComponent(id)}`}
              >
                {edit}
              </Link>
            </Tooltip>
            <Tooltip text="Remove Address">
              <button type="button" onClick={handleDelete} className={style.button}>
                {remove}
              </button>
            </Tooltip>
          </div>
        ) : null}

        {!isDefault && displayButton && (
          <button className={style.setAsDefault} type="button" onClick={() => handleSetAsDefault(id)}>
            Set as default
          </button>
        )}

        {isDefault && <p className={style.defaultText}>Default address</p>}
      </div>
    </div>
  );
}

export default Address;
