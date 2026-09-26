'use client';

import { useTranslations } from 'next-intl';

import CardHeaderPattern from '@/components/CardHeaderPattern';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import AppliedGiftCards from './AppliedGiftCards';
import CouponCodeForm from './CouponCodeForm';
import DiscountCodes from './DiscountCodes';
import GiftCardForm from './GiftCardForm';

import { Tag } from 'lucide-react';

const CartPromoCode = () => {
  const t = useTranslations('cart');

  return (
    <Card>
      <CardHeaderPattern
        className="pb-4 md:pb-6"
        size={4}
        title={
          <span className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-secondary" />
            {t('promoCode')}
          </span>
        }
        description={t('promoDescription')}
      />
      <CardContent>
        <CouponCodeForm />
      </CardContent>
      <CardFooter className="pt-4 md:pt-6">
        <DiscountCodes />
      </CardFooter>
      <CardContent className="space-y-4">
        <Separator />
        <div className="space-y-2">
          <h3 className="text-body font-medium">{t('giftCards')}</h3>
          <p className="text-body-sm text-secondary">{t('giftCardHint')}</p>
          <GiftCardForm />
          <AppliedGiftCards />
        </div>
      </CardContent>
    </Card>
  );
};

export default CartPromoCode;
