import style from './DefaultAddress.module.scss';

export default function DefaultAddress({ defaultAddress }) {
  return (
    <div className={style.DefaultAddress}>
      {defaultAddress ? (
        defaultAddress.toString()
      ) : (
        <p>No address registered</p>
      )}
    </div>
  );
}
