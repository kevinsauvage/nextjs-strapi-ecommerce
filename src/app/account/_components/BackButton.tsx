import Link from 'next/link';

import { Button } from '@/components/ui/button';
import config from '@/config';

import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => (
  <Button variant="secondary">
    <ArrowLeft size={16} />
    <Link href={config.routes.account}>Back to account</Link>
  </Button>
);

export default BackButton;
