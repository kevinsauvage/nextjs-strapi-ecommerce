import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { bag, heart, home, logout, user } from '@/assets/svg';
import config from '@/config/index';
import { handleGetTokenCookies } from '@/helpers/cookies';

import Collapsible from '../Collapsible/Collapsible';
import Logo from '../Logo/Logo';
import SlideIn from '../SlideIn/SlideIn';

import styles from './HamburgerMenu.module.scss';

const HamburgerMenu = ({ headerMenu }) => {
  const [userMenuItems, setUserMenuItems] = useState();
  const router = useRouter();

  const renderMenuItem = (menuItem) => {
    const { title, url, items } = menuItem;

    return (
      <li key={menuItem.id} className={styles.menuItem}>
        {items && items.length > 0 ? (
          <Collapsible
            title={title}
            extraClass={{ header: styles.collapsableHeader, container: styles.collapsableContainer }}
          >
            <ul className={styles.subMenu}>{items.map((item) => renderMenuItem(item))}</ul>
          </Collapsible>
        ) : (
          <Link
            href={url.replace('https://ecomfashionstore.myshopify.com', window?.location.origin)}
            className={styles.menuLink}
          >
            {title}
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12.59 1.41L16.17 5H4V7H16.17L12.58 10.59L14 12L20 6L14 0L12.59 1.41ZM0 0V12H2V0H0Z"
                fill="black"
              />
            </svg>
          </Link>
        )}
      </li>
    );
  };

  useEffect(() => {
    const setUserMenu = async () => {
      const shopifyToken = await handleGetTokenCookies(config.cookies.shopifyToken);
      setUserMenuItems([
        { icon: home, link: '/', text: 'Home', condition: true, id: 5 },

        {
          icon: user,
          link: shopifyToken ? config.routes.account : config.routes.login,
          text: shopifyToken ? 'Account' : 'Login',
          condition: true,
          id: 1,
        },
        { icon: heart, link: config.routes.wishlist, text: 'Wishlist', condition: true, id: 2 },
        { icon: bag, link: config.routes.cart, text: 'Cart', condition: true, id: 3 },
        { icon: logout, link: config.routes.logout, text: 'Logout', condition: shopifyToken, id: 4 },
      ]);
    };
    setUserMenu();
  }, [router.asPath]);

  return (
    <div className={styles.HamburgerMenu}>
      <SlideIn
        animationPosition="left"
        headerTitle={<Logo />}
        title={
          <span className={styles.icon}>
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 1H0.5" stroke="#000001" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.5 6H0.5" stroke="#000001" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.5 11H0.5" stroke="#000001" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        }
      >
        <nav>
          <ul className={styles.menu}>
            {headerMenu?.map((item) => renderMenuItem(item))}

            <li>
              <nav className={styles.userNav}>
                <ul className={styles.userNavList}>
                  {userMenuItems?.map((menuItem) =>
                    menuItem.condition ? (
                      <li key={menuItem.id} className={styles.userNavListItem}>
                        <Link href={menuItem.link}>
                          {menuItem.icon} {menuItem.text}
                        </Link>
                      </li>
                    ) : null
                  )}
                </ul>
              </nav>
            </li>
          </ul>
        </nav>
      </SlideIn>
    </div>
  );
};

export default HamburgerMenu;
