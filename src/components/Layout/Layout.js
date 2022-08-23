import { useContext, useEffect } from 'react';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import SearchBar from '../SearchBar/SearchBar';
import styles from './Layout.module.scss';
import Cart from '../../ComponentsSlide/Cart/Cart';
import User from '../../ComponentsSlide/User/User';
import CategoryButtons from '../CategoryButtons/CategoryButtons';
import { UserContext } from '../../contexts/UserContext/UserContext';

function Layout({ children, categories, user }) {
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
        <CategoryButtons categories={categories} />
        <div className={styles.children}>{children}</div>
      </div>
      <Footer />
    </>
  );
}

export default Layout;
