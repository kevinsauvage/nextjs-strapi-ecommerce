import AccountRow from '../AccountRow/AccountRow';
import style from './AccountInfo.module.scss';

export default function AccountInfo({ user }) {
  const { firstName, lastName, phone, email, acceptsMarketing } = user;
  return (
    <div className={style.AccountInfo}>
      <AccountRow
        title="First name"
        content={firstName ? `${firstName}` : ''}
      />
      <AccountRow title="Last name" content={lastName ? `${lastName}` : ''} />
      <AccountRow title="Email" content={email} />
      <AccountRow title="Phone" content={phone} />
      <AccountRow
        title="Accepts Marketing"
        content={acceptsMarketing ? 'True' : 'False'}
      />
    </div>
  );
}
