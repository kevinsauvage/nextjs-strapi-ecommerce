import Link from 'next/link';
import config from '@/config/index';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
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
            <Link className={style.button} href={`${config.routes.updateAddress}/${encodeURIComponent(id)}`}>
              <FaRegEdit />
            </Link>
            <button type="button" onClick={handleDelete} className={style.button}>
              <FaRegTrashAlt />
            </button>
          </div>
        ) : null}

        {!isDefault && displayButton ? (
          <button className={style.setAsDefault} type="button" onClick={() => handleSetAsDefault(id)}>
            Set as default
          </button>
        ) : (
          <p className={style.defaultText}>This is your default delivery address</p>
        )}
      </div>
    </div>
  );
}

export default Address;
