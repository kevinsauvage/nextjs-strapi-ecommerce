import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer } from 'react-toastify';
import Footer from '@/components/Footer/Footer';
import Header from '@/components/Header/Header';
import SearchBar from '@/components/SearchBar/SearchBar';
import Cart from '@/components/Cart/Cart';
import User from '@/components/User/User';
import styles from './Layout.module.scss';
import TopHeader from '../topHeader/TopHeader';
import CategoryButtons from '../CategoryButtons/CategoryButtons';

function Layout({ children, collections }) {
  return (
    <>
      <SearchBar />
      <Cart />
      <User />
      <div className={styles.container}>
        <TopHeader />
        <Header />
        <CategoryButtons collections={collections} />
        <div className={styles.children}>{children}</div>
      </div>
      <ToastContainer position="bottom-center" newestOnTop theme="dark" />
      <Footer collections={collections} />
    </>
  );
}

export default Layout;
