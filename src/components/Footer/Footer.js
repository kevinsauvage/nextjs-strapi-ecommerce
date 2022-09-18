import Link from 'next/link';
import routes from '@/data/routes';
import Container from '@/components/Container/Container';
import styles from './Footer.module.scss';

function Footer({ collections }) {
  const getCollections = () =>
    collections?.map((category) => ({
      name: category.title,
      href: `${routes.base.collection}/${category.handle}`,
      id: category.id,
    }));

  const linkInfo = [
    {
      title: 'About us',
      id: 1,
      text: 'Dicci is a fashion brand made for unisex use with an irreverent style. It started with jewelry, but has scaled up to something bigger and the reason for that is that we are fashion lovers.Our goal is to give you the best quality at an affordable price.',
    },
    {
      title: 'Information',
      id: 2,
      items: [
        { href: routes.base.contact, name: 'Contact', id: 1 },
        { href: routes.base.privacy, name: 'Privacy', id: 2 },
        { href: routes.base.terms, name: 'Terms', id: 3 },
      ],
    },
    {
      title: 'Collections',
      id: 3,
      items: getCollections(),
    },
  ];

  return (
    <footer className={styles.container}>
      <Container>
        <div className={styles.top}>
          <nav className={styles.nav}>
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
                    {item.text && <p>{item.text}</p>}
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
