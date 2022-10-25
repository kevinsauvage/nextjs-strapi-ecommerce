import Link from 'next/link';
import routes from '@/data/routes';
import Container from '@/layout/Container/Container';
import styles from './Footer.module.scss';

function Footer({ collections }) {
  const getCollections = () =>
    collections?.map((category) => ({
      name: category.title,
      href: `${routes.collection}/${category.handle}`,
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
        { href: routes.contact, name: 'Contact', id: 1 },
        { href: routes.privacy, name: 'Privacy', id: 2 },
        { href: routes.terms, name: 'Terms', id: 3 },
        { href: routes.refound, name: 'Refound', id: 4 },
        { href: routes.shipping, name: 'Shipping', id: 5 },
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
                  <h5 className={styles.title}>{item.title}</h5>
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
                <Link href={routes.terms}>Term and condition</Link>
              </li>
              /
              <li className={styles.item}>
                <Link href={routes.privacy}>Privacy policy</Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
