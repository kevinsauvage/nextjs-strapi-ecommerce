import React from 'react';

import styles from './AccountRow.module.scss';

const AccountRow = ({
  title,
  content,
}: {
  title: string;
  content: string | number | React.JSX.Element | React.JSX.Element[];
}) => (
  <div className={styles.row}>
    <b className={styles.title}>{title}:</b>
    <p>{content}</p>
  </div>
);

export default AccountRow;
