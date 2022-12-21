import style from './DefaultAddress.module.scss';

export default function DefaultAddress({ defaultAddress = {} }) {
  console.log('DefaultAddress', defaultAddress);

  const { name, address1, address2, city, province, country, zip, phone } =
    defaultAddress;

  return (
    <div className={style.DefaultAddress}>
      <div className="customer-address">
        <p>{name}</p>
        <p>{address1}</p>
        {address2 && <p>{address2}</p>}
        <p>
          {city}, {province} {zip} {country}
        </p>
        {phone && <p>{phone}</p>}
      </div>
    </div>
  );
}
