import { ChevronLeft, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCartAction } from '@/actions/cartActions';
import CheckoutButton from '@/components/CheckoutButton';
import PageInfoPagination from '@/components/PageInfoPagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import CartRemove from './_components/CartRemove';
import QuantityUpdatedContainer from './_components/QuantityUpdatedContainer';

const CartPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    after?: string;
    before?: string;
    first?: string;
    last?: string;
  }>;
}) => {
  const searchParameters = await searchParams;

  const cart = await getCartAction({
    after: searchParameters.after,
    before: searchParameters.before,
    first: searchParameters.first ? Number.parseInt(searchParameters.first, 10) : undefined,
    last: searchParameters.last ? Number.parseInt(searchParameters.last, 10) : undefined,
  });

  if (!cart) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Continue Shopping
        </Link>
        <h1 className="text-2xl font-bold ml-auto">Your Cart</h1>
        <div className="ml-auto flex items-center">
          <ShoppingCart className="h-5 w-5 mr-2" />
          <span className="font-medium">{cart.totalQuantity} Items</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.lines.edges.map(({ node }) => (
                  <div key={node.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={node.merchandise.image.medium as string}
                        alt={node.merchandise.product.title}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{node.merchandise.product.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        $
                        {typeof node.merchandise.price.amount === 'string'
                          ? Number.parseFloat(node.merchandise.price.amount).toFixed(2)
                          : node.merchandise.price.amount}
                      </p>
                    </div>
                    <QuantityUpdatedContainer
                      originalQuantity={node.quantity}
                      quantityAvailable={node.merchandise.quantityAvailable}
                      id={node.id}
                    />
                    <div className="text-right min-w-[80px]">
                      <p className="font-medium">
                        ${(node.merchandise.price.amount * node.quantity).toFixed(2)}
                      </p>
                    </div>
                    <CartRemove id={node.id} />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <PageInfoPagination
                pageInfo={cart.lines.pageInfo}
                searchParameters={searchParameters}
              />
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    ${cart.cost.subtotalAmount.amount} {cart.cost.subtotalAmount.currencyCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>
                    ${cart.cost.totalTaxAmount?.amount ?? '0.00'}{' '}
                    {cart.cost.totalTaxAmount?.currencyCode}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>
                    ${cart.cost.totalAmount.amount} {cart.cost.totalAmount.currencyCode}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <CheckoutButton checkoutUrl={cart?.checkoutUrl as string} />
            </CardFooter>
          </Card>

          <div className="mt-6 space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Promo Code</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button variant="outline">Apply</Button>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Shipping Options</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="shipping" className="h-4 w-4" defaultChecked />
                  <span>Standard Shipping (3-5 business days)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="shipping" className="h-4 w-4" />
                  <span>Express Shipping (1-2 business days)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
