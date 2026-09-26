'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const { setTheme } = useTheme();
  const t = useTranslations('shared');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="flex items-center justify-center">
        <button
          aria-label={t('toggleTheme')}
          className="cursor-pointer flex items-center justify-center min-h-11 min-w-11"
        >
          <Sun
            size={22}
            strokeWidth={1.5}
            className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:absolute dark:scale-0"
          />
          <Moon
            size={22}
            strokeWidth={1.5}
            className="rotate-90 scale-0 transition-all absolute dark:relative dark:rotate-0 dark:scale-100"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>{t('themeLight')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>{t('themeDark')}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>{t('themeSystem')}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
