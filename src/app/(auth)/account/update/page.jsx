import seo from '@/data/seo';
import { getUser } from '@/utils/users';

import UpdateUserForm from './_components/UpdateUserForm';

const Page = async () => {
  const user = await getUser();

  return (
    <div>
      <h2>{seo.account.update.title}</h2>
      <UpdateUserForm user={user} />
    </div>
  );
};

export default Page;
