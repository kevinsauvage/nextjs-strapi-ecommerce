'use client';

import { useRouter } from 'next/navigation';

import Button from '@/components/Button/Button';

const ContinueShoppingButton = () => {
  const router = useRouter();

  return (
    <Button
      text="CONTINUE SHOPPING"
      contrast
      onClick={() => {
        if (document.referrer.includes(window.location.origin)) router.back();
        else router.push('/');
      }}
    />
  );
};

export default ContinueShoppingButton;
