import type { Metadata } from 'next';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import seo from '@/data/seo';

import BackButton from '../_components/BackButton';
import UpdateUserForm from './_components/UpdateUserForm';

export const metadata: Metadata = {
  description: seo.account.update.description,
  title: seo.account.update.title,
};

const Page = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="text-heading-3">Update Account</h2>
        </CardTitle>
        <CardDescription className="text-body text-secondary">
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
