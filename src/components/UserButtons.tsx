'use client';
import { Search, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';

import config from '@/config/index';
import useCartContext from '@/contexts/CartContext/useCartContext';

import { Badge } from './ui/badge';
import ThemeToggle from './ThemeToggle';

const UserButtons = ({ className }: { className?: string }) => {
  const { cart } = useCartContext();

  return (
    <div className={`hidden md:flex md:items-center md:order-3 gap-2 lg:gap-4 ${className}`}>
      <ThemeToggle />
      <Link aria-label="Search" className="cursor-pointer" href={config.routes.search}>
        <Search size={30} strokeWidth={1} className="hidden md:block" />
      </Link>

      <Link
        aria-label={'User account'}
        className="cursor-pointer flex items-center justify-center"
        href={config.routes.account}
      >
        <User size={30} strokeWidth={1} className="hidden md:block" />
      </Link>

      <Link
        className="relative cursor-pointer flex items-center justify-center"
        href={config.routes.cart}
        aria-label={'Toggle Checkout'}
      >
        <ShoppingBag size={30} strokeWidth={1} />
        <Badge className="absolute -top-3 -right-3 rounded-full font-bold bg-red-800 text-white">
          {cart?.totalQuantity || 0}
        </Badge>
      </Link>
    </div>
  );
};

export default UserButtons;
