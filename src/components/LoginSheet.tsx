import { User } from 'lucide-react';

import LoginForm from '@/app/(auth)/login/_components/LoginForm';
import config from '@/config';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const LoginSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button aria-label="Login" className="p-2 rounded-full hover:bg-accent transition">
          <User size={30} strokeWidth={1.5} className="hidden md:block text-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="sm:max-w-md w-full flex flex-col justify-between gap-6 shadow-xl rounded-l-2xl"
      >
        <div>
          <SheetHeader className="mb-6 text-left border-b pb-4">
            <SheetTitle className="text-2xl font-bold">Welcome Back</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              Enter your credentials to access your account.
            </SheetDescription>
          </SheetHeader>

          <div className="p-4">
            <LoginForm />
          </div>
        </div>
        <SheetFooter className="border-t pt-4">
          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{' '}
            <a href={config.routes.register} className="text-primary hover:underline">
              Sign up
            </a>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default LoginSheet;
