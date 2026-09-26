'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { reorderAction } from '@/actions/cartActions';
import { Button } from '@/components/ui/button';
import config from '@/config';
import { useLocalizedPush } from '@/i18n/client';
import { reportError } from '@/lib/logger';

import { Printer, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const OrderDetailActions = ({ orderId, orderName }: { orderId: string; orderName: string }) => {
  const t = useTranslations('account');
  const push = useLocalizedPush();
  const [isReordering, setIsReordering] = useState(false);

  const handleReorder = async () => {
    setIsReordering(true);
    try {
      const response = await reorderAction(orderId);
      toast.success(response.message ?? t('reorderSuccess', { name: orderName }));
      push(config.routes.cart);
    } catch (error) {
      reportError('order-detail/reorder', error);
      toast.error(error instanceof Error ? error.message : t('reorderError'));
      setIsReordering(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => window.print()}>
        <Printer size={16} aria-hidden="true" />
        {t('print')}
      </Button>
      <Button size="sm" loading={isReordering} onClick={handleReorder}>
        <RotateCcw size={16} aria-hidden="true" />
        {t('reorder')}
      </Button>
    </div>
  );
};

export default OrderDetailActions;
