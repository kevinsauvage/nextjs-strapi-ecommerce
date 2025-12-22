import type { Metadata } from 'next';

import CardHeaderPattern from '@/components/CardHeaderPattern';
import { Card, CardContent } from '@/components/ui/card';
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
      <CardHeaderPattern
        title="Update Account"
        size={3}
        actions={<BackButton />}
        description="Update your account information and preferences."
      />
      <CardContent>
        <UpdateUserForm />
      </CardContent>
    </Card>
  );
};

export default Page;
