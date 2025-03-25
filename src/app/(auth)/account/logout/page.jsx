import Loader from '@/components/_loaders/Loader/Loader';

import LogoutClientEffect from './_components/LogoutClientEffect';

const Page = () => {
  return (
    <div>
      <h2>Login out...</h2>
      <Loader />
      <LogoutClientEffect />
    </div>
  );
};

export default Page;
