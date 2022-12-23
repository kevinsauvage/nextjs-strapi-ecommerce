import AccountRow from '../AccountRow/AccountRow';
import style from './AccountInfo.module.scss';

export default function AccountInfo({ user }) {
  return (
    <div className={style.AccountInfo}>
      <AccountRow
        title="Name"
        content={user?.firstName ? `${user?.firstName} ${user?.lastName}` : ''}
      />
      <AccountRow title="Email" content={user?.email} />
      <AccountRow title="Member since" content="TODO" />
      <AccountRow title="Total spent" content="TODO" />
    </div>
  );
}
