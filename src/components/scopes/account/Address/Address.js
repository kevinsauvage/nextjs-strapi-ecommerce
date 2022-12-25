import Link from 'next/link';
import config from '@/config/index';
import limitStrLength from 'src/utils/limitStringLength';
import AccountRow from '../AccountRow/AccountRow';
import style from './Address.module.scss';

function Address({
  address,
  isAccount,
  handleChange,
  isDefault,
  handleDelete,
  displayButton = true,
}) {
  const {
    id,
    address1,
    address2,
    city,
    country,
    firstName,
    lastName,
    province,
    zip,
    company,
    phone,
  } = address || {};

  return (
    <div className={style.address}>
      {isDefault && <div className={style.tag}>Default address</div>}
      <AccountRow title="Name" content={`${firstName} ${lastName}`} />
      <AccountRow title="Address1" content={limitStrLength(address1, 30)} />
      {address2 && <AccountRow title="Address2" content={address2} />}
      {company && <AccountRow title="Company" content={company} />}
      {phone && <AccountRow title="Phone" content={phone} />}
      <AccountRow title="Zip" content={zip} />
      <AccountRow title="City" content={city} />
      <AccountRow title="Province" content={province} />
      <AccountRow title="Country" content={country} />
      {displayButton && !isDefault && !isAccount && (
        <div className={style.buttons}>
          <Link
            className={style.button}
            href={`${config.routes.updateAddress}/${id.replace(
              'gid://shopify/MailingAddress/',
              ''
            )}`}
          >
            Edit
          </Link>

          <button type="button" onClick={handleDelete} className={style.button}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default Address;
