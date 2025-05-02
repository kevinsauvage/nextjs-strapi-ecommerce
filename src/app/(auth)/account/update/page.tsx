import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import UpdateUserForm from './_components/UpdateUserForm';

const Page = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Account</CardTitle>
        <CardDescription>
          Update your account information and preferences. Ensure your details are up to date for a
          better experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateUserForm />
      </CardContent>
    </Card>
  );
};

export default Page;
