import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function Custom404() {
  const router = useRouter();
  useEffect(() => {
    router.push('/');
  }, [router]);
  return <div />;
}

export default Custom404;
