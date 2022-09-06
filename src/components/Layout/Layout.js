import 'react-toastify/dist/ReactToastify.min.css';
import { useContext, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { UserContext } from '@/contexts/UserContext/UserContext';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import SearchBar from '@/components/SearchBar/SearchBar';
import Cart from '@/components/Cart/Cart';
import User from '@/components/User/User';
import styles from './Layout.module.scss';

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
      <ToastContainer position="bottom-center" newestOnTop theme="dark" />
      <Footer collections={collections} />
    </>
  );
}

export default Layout;
