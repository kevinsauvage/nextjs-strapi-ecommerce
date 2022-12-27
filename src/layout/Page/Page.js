import Head from 'next/head';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import config from '@/config/index';
import { MdOutlineLogout } from 'react-icons/md';
import { useRouter } from 'next/router';
import nextApiCall from '@/utils/apiNext';
import useGlobalContext from '@/contexts/GlobalContext/useGlobalContext';
import { toast } from 'react-toastify';
import PageLoader from '../Loader/PageLoader/PageLoader';
import Container from '../Container/Container';
import styles from './Page.module.scss';

export default function Page({
  children,
  title,
  description,
  loading,
  bannerTitle,
  bannerDescription,
}) {
  const { pathname, push } = useRouter();
  const siteTitle = `${config.name} | ${title}`;
  const { toggleLoading } = useGlobalContext();
  const { userFeedback } = config;

  const logout = async () => {
    toggleLoading(true);
    const res = await nextApiCall.logout();
    toggleLoading(false);
    if (res?.ok) {
      return push(config.routes.login);
    }
    return toast.error(userFeedback.logout.error);
  };

  return (
    <div className={`${styles.page}`}>
      <Head>
        <title>{siteTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <Container>
        {loading && <PageLoader />}
        <Breadcrumbs />

        {bannerDescription && bannerTitle && (
          <div className={styles.banner}>
            {pathname.startsWith('/account') && (
              <button type="button" className={styles.logOut} onClick={logout}>
                <p>Logout</p>
                <MdOutlineLogout />
              </button>
            )}
            <h1 className={styles.title}>{bannerTitle}</h1>
            <p className={styles.subtitle}>{bannerDescription}</p>
          </div>
        )}
        <div className={styles.children}>{children}</div>
      </Container>
    </div>
  );
}
