'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ThemeToggle = () => {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex items-center justify-center">
        <button aria-label="toggle theme" className="cursor-pointer">
          <Sun
            size={30}
            strokeWidth={1}
            className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:absolute dark:scale-0"
          />
          <Moon
            size={30}
            strokeWidth={1}
            className="rotate-90 scale-0 transition-all absolute dark:relative dark:rotate-0 dark:scale-100"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
