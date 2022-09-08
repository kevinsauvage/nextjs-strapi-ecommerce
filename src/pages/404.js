import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function Custom404() {
  const router = useRouter();
  useEffect(() => {
    router.push('/');
  }, []);
  return <div />;
}

export default Custom404;

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../locales/${locale}.json`)).default,
    },
  };
}
