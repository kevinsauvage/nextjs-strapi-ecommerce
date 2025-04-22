import seo from '@/data/seo';

import UpdateUserForm from './_components/UpdateUserForm';

const Page = () => {
  return (
    <div>
      <h2>{seo.account.update.title}</h2>
      <UpdateUserForm />
    </div>
  );
};

export default Page;
