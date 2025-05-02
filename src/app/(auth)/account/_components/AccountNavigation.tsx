'use client';

import { BookText, BookUser, Heart, LogOut, Package, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { accountNav } from '@/config';

const getLinkIcon = (title: string) => {
  const icons = {
    'Account overview': <User size={16} />,
    'Address book': <BookUser size={16} />,
    'My details': <BookText size={16} />,
    'My orders': <Package size={16} />,
    'My wishlist': <Heart size={16} />,
    'Sign out': <LogOut size={16} />,
  };

  return icons[title as keyof typeof icons] as React.ReactNode;
};

const AccountNavigation = ({ handleClose }: { handleClose?: () => void }) => {
  const currentPathname = usePathname();

  return (
    <nav className="flex flex-col">
      {accountNav.map((link, index) => {
        const Icon = getLinkIcon(link.title);
        return (
          <Link
            key={index}
            href={link.url}
            className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors ${
              currentPathname === link.url ? 'bg-muted font-medium' : ''
            }`}
            onClick={() => {
              handleClose?.();
            }}
          >
            {Icon}
            {link.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default AccountNavigation;
