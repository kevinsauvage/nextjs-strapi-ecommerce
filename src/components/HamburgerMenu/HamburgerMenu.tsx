import type { GetMenuByHandleQuery, MenuItem } from '@/shopify/storefront';
import Link from 'next/link';

import { bag, heart, home, logout, user } from '@/assets/svg';
import config from '@/config/index';

import Collapsible from '../Collapsible/Collapsible';
import Logo from '../Logo/Logo';
import SlideIn from '../SlideIn/SlideIn';

import styles from './HamburgerMenu.module.scss';

const HamburgerMenu = ({
  headerMenu,
  shopifyToken,
}: {
  headerMenu: GetMenuByHandleQuery['menu']['items'];
  shopifyToken: string | null;
}) => {
  const renderMenuItem = (menuItem: MenuItem) => {
    const { title, items, id } = menuItem || {};

    return (
      <li key={id}>
        {items && items.length > 0 ? (
          <Collapsible title={title}>
            <ul className={styles['sub-menu']}>{items.map((item) => renderMenuItem(item))}</ul>
          </Collapsible>
        ) : (
          typeof menuItem.url === 'string' && (
            <Link
              href={menuItem.url.replace(
                'https://ecomfashionstore.myshopify.com',
                global.window?.location.origin,
              )}
              className={styles['menu-link']}
            >
              {title}
              <svg
                width="20"
                height="12"
                viewBox="0 0 20 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.59 1.41L16.17 5H4V7H16.17L12.58 10.59L14 12L20 6L14 0L12.59 1.41ZM0 0V12H2V0H0Z"
                  fill="black"
                />
              </svg>
            </Link>
          )
        )}
      </li>
    );
  };

  const userMenuItems = [
    { condition: true, icon: home, id: 5, link: '/', text: 'Home' },

    {
      condition: true,
      icon: user,
      id: 1,
      link: shopifyToken ? config.routes.account : config.routes.login,
      text: shopifyToken ? 'Account' : 'Login',
    },
    { condition: true, icon: heart, id: 2, link: config.routes.wishlist, text: 'Wishlist' },
    { condition: true, icon: bag, id: 3, link: config.routes.cart, text: 'Cart' },
    {
      condition: shopifyToken,
      icon: logout,
      id: 4,
      link: config.routes.logout,
      text: 'Logout',
    },
  ];

  return (
    <div className={styles['hamburger-menu']}>
      <SlideIn
        animationPosition="left"
        headerTitle={<Logo />}
        title={
          <span className={styles.icon}>
            <svg
              width="14"
              height="12"
              viewBox="0 0 14 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13.5 1H0.5" stroke="#000001" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.5 6H0.5" stroke="#000001" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M13.5 11H0.5"
                stroke="#000001"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        }
      >
        <nav>
          <ul className={styles.menu}>
            {headerMenu?.map((item) => renderMenuItem(item as MenuItem))}

            <li>
              <nav className={styles['user-nav']}>
                <ul>
                  {userMenuItems?.map(
                    (menuItem) =>
                      menuItem.condition && (
                        <li key={menuItem.id} className={styles['user-nav-list-item']}>
                          <Link href={menuItem.link}>
                            {menuItem.icon} {menuItem.text}
                          </Link>
                        </li>
                      ),
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
