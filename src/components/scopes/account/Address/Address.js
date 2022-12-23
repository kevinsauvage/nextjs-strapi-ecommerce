import AccountRow from '../AccountRow/AccountRow';
import style from './Address.module.scss';

function Address({ address, buttonText, handleClick }) {
  const {
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
      <p className={style.name} />
      <AccountRow title="Name" content={`${firstName} ${lastName}`} />
      <AccountRow title="Address1" content={address1} />
      {address2 && <AccountRow title="Address2" content={address2} />}
      {company && <AccountRow title="Company" content={company} />}
      {phone && <AccountRow title="Phone" content={phone} />}
      <AccountRow title="Zip" content={zip} />
      <AccountRow title="City" content={city} />
      <AccountRow title="Province" content={province} />
      <AccountRow title="Country" content={country} />
      <button
        type="button"
        onClick={() => handleClick(address)}
        className={style.button}
      >
        {buttonText}
      </button>
    </div>
  );
}

export default Address;
