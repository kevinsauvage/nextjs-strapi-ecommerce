'use client';
import { Search, ShoppingBag, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import config from '@/config/index';
import useCartContext from '@/contexts/CartContext/useCartContext';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import ThemeToggle from './ThemeToggle';

const UserButtons = ({ className }: { className?: string }) => {
  const { cart } = useCartContext();
  const searchParameters = useSearchParams();
  const router = useRouter();

  const data = [
    {
      id: 'theme',
      item: <ThemeToggle />,
    },
    {
      id: 'search',
      item: (
        <Drawer>
          <DrawerTrigger asChild className="flex items-center justify-center">
            <button aria-label="Search" className="cursor-pointer">
              <Search size={30} strokeWidth={1} className="hidden md:block" />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Search</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <input
                  id="searchQuery"
                  type="text"
                  name="searchQuery"
                  defaultValue={searchParameters.get('searchQuery') || ''}
                  placeholder="Search"
                  aria-label="Search"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-input/70 dark:bg-input dark:text-foreground/80 dark:placeholder:text-muted-foreground/80 dark:focus-visible:ring-offset-background"
                />
              </div>
              <DrawerFooter>
                <Button
                  onClick={() => {
                    const searchQuery: HTMLInputElement = document.querySelector('#searchQuery');

                    if (searchQuery?.value) {
                      router.push(`${config.routes.search}?searchQuery=${searchQuery.value}`);
                    }
                  }}
                >
                  Submit
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      ),
    },

    {
      id: 'user',
      item: (
        <button
          aria-label={'User account'}
          type="button"
          className="cursor-pointer flex items-center justify-center"
          onClick={() => router.push(config.routes.account)}
        >
          <User size={30} strokeWidth={1} className="hidden md:block" />
        </button>
      ),
    },

    {
      id: 'cart',
      item: (
        <button
          className="relative cursor-pointer flex items-center justify-center"
          onClick={() => router.push(config.routes.cart)}
          aria-label={'Toggle Checkout'}
        >
          <ShoppingBag size={30} strokeWidth={1} />
          {cart?.totalQuantity ? (
            <Badge className="absolute -top-3 -right-3 rounded-full font-bold bg-red-800 text-white">
              {cart?.totalQuantity}
            </Badge>
          ) : null}
        </button>
      ),
    },
  ];

  return (
    <div className={`hidden md:flex md:items-center md:order-3 gap-2 lg:gap-4 ${className}`}>
      {data.map((element) => element.item && <span key={element.id}>{element.item}</span>)}
    </div>
  );
};

export default UserButtons;
