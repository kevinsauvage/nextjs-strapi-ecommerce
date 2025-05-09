import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import BackButton from '../_components/BackButton';

import UpdateUserForm from './_components/UpdateUserForm';

const Page = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Account</CardTitle>
        <CardDescription>
          <p className="mb-4">
            Update your account information and preferences. Ensure your details are up to date for
            a better experience.
          </p>
          <BackButton />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateUserForm />
      </CardContent>
    </Card>
  );
};

export default Page;
