import Link from 'next/link';
import { useTranslations } from 'next-intl';
import routes from '@/data/routes';
import Container from '@/components/Container/Container';
import styles from './Footer.module.scss';

function Footer({ collections }) {
  const t = useTranslations('link');

  const getCollections = () =>
    collections?.map((category) => ({
      name: category.title,
      href: `${routes.base.collection}/${category.handle}`,
      id: category.id,
    }));

  const linkInfo = [
    {
      title: 'Information',
      id: 1,
      items: [
        { href: routes.base.contact, name: t('Contact'), id: 1 },
        { href: routes.base.privacy, name: t('Privacy'), id: 2 },
        { href: routes.base.terms, name: t('Terms'), id: 3 },
      ],
    },
    {
      title: 'Shop by pet',
      id: 2,
      items: getCollections(),
    },
  ];

  return (
    <footer className={styles.container}>
      <Container>
        <div className={styles.top}>
          <nav>
            <ul className={styles.navList}>
              {linkInfo.map((item) => (
                <li key={item.id}>
                  <p className={styles.title}>{item.title}</p>
                  <ul className={styles.nav}>
                    {item?.items?.map((el) => (
                      <li className={styles.navItem} key={el.id}>
                        <Link href={el.href}>{el.name}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className={styles.bottom}>
          <p>Copyright © 2022 All rights reserved.</p>
          <nav>
            <ul className={styles.list}>
              <li className={styles.item}>
                <Link href={routes.base.terms}>Term and condition</Link>
              </li>
              /
              <li className={styles.item}>
                <Link href={routes.base.privacy}>Privacy policy</Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
