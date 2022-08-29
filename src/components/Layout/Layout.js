import { useContext, useEffect } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import SearchBar from '../SearchBar/SearchBar';
import styles from './Layout.module.scss';
import Cart from '../../ComponentsSlide/Cart/Cart';
import User from '../../ComponentsSlide/User/User';
import { UserContext } from '../../contexts/UserContext/UserContext';

function Layout({ children, collections, user }) {
  const { addUser } = useContext(UserContext);

  useEffect(() => {
    if (user && user.id) addUser(user);
  }, []);

  return (
    <>
      <SearchBar />
      <Cart />
      <User />
      <div className={styles.container}>
        <Header />
        <div className={styles.children}>{children}</div>
      </div>
      <Footer collections={collections} />
    </>
  );
}

export default Layout;
