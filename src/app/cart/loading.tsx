import { ChevronLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

import CardHeaderPattern from '@/components/CardHeaderPattern';
import PageBanner from '@/components/PageBanner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <div className="pb-8 max-w-6xl mx-auto">
      <PageBanner title="Your Cart" className="w-full pb-4">
        <div className="flex items-center justify-between gap-2 w-full">
          <Link
            href="/"
            className="group flex items-center text-body-sm text-secondary hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4 mr-1 text-secondary group-hover:text-primary transition-colors" />
            Continue Shopping
          </Link>
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-secondary" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
      </PageBanner>

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeaderPattern title="Cart Items" size={4} />
            <CardContent>
              <div className="space-y-2">
                {new Array(3).fill(0).map((_, index) => (
                  <div key={index}>
                    <div className="relative flex flex-col gap-2 md:flex-row md:items-center">
                      <div className="flex gap-4 basis-1/2">
                        <div className="shrink-0">
                          <Skeleton className="w-20 h-20 rounded-md" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-5 w-32 mb-2" />
                          <Skeleton className="h-4 w-24 mb-1" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                      <div className="flex flex-row justify-between items-center gap-4 flex-1 min-w-0 md:justify-end">
                        <Skeleton className="h-10 w-24" />
                        <div className="flex flex-col items-end">
                          <Skeleton className="h-5 w-16 mb-1" />
                        </div>
                        <Skeleton className="h-10 w-10 rounded-full" />
                      </div>
                    </div>
                    {index < 2 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeaderPattern title="Order Summary" size={4} />
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Separator />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>

          <Card className="mt-4">
            <CardHeaderPattern
              title="Promo Code"
              size={4}
              description={<Skeleton className="h-4 w-full" />}
            />
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-6 w-32" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Loading;
