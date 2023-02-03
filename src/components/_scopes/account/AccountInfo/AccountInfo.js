import Link from 'next/link';
import { FaRegEdit } from 'react-icons/fa';
import config from '@/config/index';
import AccountRow from '../AccountRow/AccountRow';
import style from './AccountInfo.module.scss';

export default function AccountInfo({ user }) {
  const { firstName, lastName, phone, email, acceptsMarketing } = user || {};
  return (
    <div className={style.AccountInfo}>
      <div className={style.header}>
        <h5 className={style.title}>Account Information</h5>
        <Link className={style.button} href={`${config.routes.updateAccount}`}>
          <FaRegEdit />
        </Link>
      </div>
      <AccountRow title="First name" content={firstName ? `${firstName}` : ''} />
      <AccountRow title="Last name" content={lastName ? `${lastName}` : ''} />
      <AccountRow title="Email" content={email} />
      <AccountRow title="Phone" content={phone} />
      <AccountRow title="Accepts Marketing" content={acceptsMarketing ? 'True' : 'False'} />
    </div>
  );
}
