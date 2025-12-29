import Link from 'next/link';

import { Button } from '@/components/ui/button';
import config from '@/config';

import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => (
  <Button variant="secondary" asChild>
    <Link href={config.routes.account} className="flex items-center gap-2">
      <ArrowLeft size={16} />
      Back to account
    </Link>
  </Button>
);

export default BackButton;
