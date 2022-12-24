import React from 'react';
import { MdOutlineAdd } from 'react-icons/md';
import Link from 'next/link';
import config from '@/config/index';
import styles from './CreateAddressButton.module.scss';

function CreateAddressButton() {
  return (
    <div className={styles.CreateAddressButton}>
      <Link href={config.routes.createAddress}>
        <div className={styles.createAddress}>
          <p> Add a new address</p>
          <span className={styles.createAddressIcon}>
            <MdOutlineAdd />
          </span>
        </div>
      </Link>
    </div>
  );
}

export default CreateAddressButton;
