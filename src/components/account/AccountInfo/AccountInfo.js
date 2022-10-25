import style from './AccountInfo.module.scss';

function AccountRow({ title, content }) {
  return (
    <div className={style.AccountRow}>
      <p className={style.title}>{title}</p>
      <p className={style.content}>{content}</p>
    </div>
  );
}

export default function AccountInfo({ user }) {
  console.log(user);
  return (
    <div className={style.AccountInfo}>
      <AccountRow
        title="Name"
        content={user?.firstName ? `${user?.firstName} ${user?.lastName}` : ''}
      />
      <AccountRow title="Email" content={user?.email} />
      <AccountRow title="Order" content={user?.orders?.edges?.length} />
      <AccountRow title="Total spent" content="Todo" />
    </div>
  );
}
