'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import SpinnerLoader from '@/components/SpinnerLoader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useCartContext from '@/contexts/CartContext/useCartContext';
import { reportError } from '@/lib/logger';

import { Trash2 } from 'lucide-react';

const CartRemove = ({ id, productTitle }: { id: string; productTitle?: string }) => {
  const t = useTranslations('cart');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { removeFromCart } = useCartContext();

  const handleRemove = async () => {
    if (!id) {
      reportError('cart/remove', 'Missing line item to delete');
      return;
    }
    setLoading(true);
    try {
      await removeFromCart(id);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={loading}
                aria-label={t('removeAria')}
                className="text-secondary hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{t('removeItem')}</span>
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('remove')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-heading-3">{t('confirmRemoveTitle')}</AlertDialogTitle>
          <AlertDialogDescription className="text-body-sm text-secondary">
            {productTitle
              ? t('confirmRemoveBodyNamed', { title: productTitle })
              : t('confirmRemoveBody')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <SpinnerLoader size="sm" />
                {t('removing')}
              </span>
            ) : (
              t('remove')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CartRemove;
