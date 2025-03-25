'use client';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { bag, heart, search, user } from '@/assets/svg';
import ModalPortal from '@/components/ModalPortal/ModalPortal';
import config from '@/config/index';
import useCartContext from '@/contexts/CartContext/useCartContext';

import Modal from '../_modals/Modal/Modal';
import SearchForm from '../SearchForm/SearchForm';

import styles from './UserButtons.module.scss';

const UserButtons = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { cart } = useCartContext();
  const searchParameters_ = useSearchParams();
  const searchParameters = new URLSearchParams(searchParameters_);

  const { push } = useRouter();
  const pathname = usePathname();

  const handleClickSearch = () => {
    if (pathname.startsWith('/search')) {
      const searchInputElement = document.querySelector('input[name="searchQuery"]');
      searchInputElement?.focus();
    } else {
      setSearchOpen((previous) => !previous);
    }
  };

  const data = [
    {
      id: 0,
      item: search,
      name: 'Search',
      onClick: () => handleClickSearch(),
    },

    {
      extraClass: styles.wishlist,
      id: 1,
      item: heart,
      name: 'Wishlist',
      onClick: () => push(config.routes.wishlist),
    },

    {
      extraClass: styles.user,
      id: 2,
      item: user,
      name: 'User account',
      onClick: () => push(config.routes.account),
    },
    {
      id: 3,
      item: (
        <div className={styles.cart}>
          {bag}
          {cart?.totalQuantity && (
            <div className={styles['total-items']}>{cart?.totalQuantity}</div>
          )}
        </div>
      ),
      name: 'Toggle Checkout',
      onClick: () => push(config.routes.cart),
    },
  ];

  return (
    <div className={styles.container}>
      {data.map((element) => (
        <button
          aria-label={element.name}
          type="button"
          key={element.id}
          onClick={() => element.onClick?.()}
          className={`${styles.button} ${element.extraClass}`}
        >
          {element.item}
        </button>
      ))}
      {searchOpen && (
        <ModalPortal>
          <Modal handleClose={() => setSearchOpen(false)}>
            <SearchForm searchQuery={new URLSearchParams(searchParameters)?.get('search')} />
          </Modal>
        </ModalPortal>
      )}
    </div>
  );
};

export default UserButtons;
