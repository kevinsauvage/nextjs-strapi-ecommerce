import { ChevronLeft, ShoppingCart } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getCartAction } from '@/actions/cartActions';
import CheckoutButton from '@/components/CheckoutButton';
import PageBanner from '@/components/PageBanner';
import PageInfoPagination from '@/components/PageInfoPagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import seo from '@/data/seo';
import type { GetCartQuery } from '@/shopify/storefront';

import CartRemove from './_components/CartRemove';
import CouponCodeForm from './_components/CouponCodeForm';
import DiscountCodes from './_components/DiscountCodes';
import QuantityUpdatedContainer from './_components/QuantityUpdatedContainer';

export const metadata: Metadata = {
  description: seo.cart.description,
  title: seo.cart.title,
};

const LineItem: React.FC<{
  node: GetCartQuery['cart']['lines']['edges'][0]['node'];
}> = ({ node }) => {
  const unitPrice =
    typeof node.merchandise.price.amount === 'string'
      ? Number.parseFloat(node.merchandise.price.amount)
      : 0;
  const totalPrice = unitPrice * node.quantity;

  const totalDiscount = node.discountAllocations.reduce(
    (accumulator, allocation) =>
      accumulator +
      Number.parseFloat(
        typeof allocation.discountedAmount.amount === 'string'
          ? allocation.discountedAmount.amount
          : '0.00',
      ),
    0,
  );
  const unitPriceFormatted = unitPrice.toFixed(2);
  const finalPrice = totalPrice - totalDiscount > 0 ? totalPrice - totalDiscount : 0;

  return (
    <div className="relative flex flex-col gap-2 md:flex-row md:items-center">
      <div className="flex gap-4 basis-1/2">
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
          <div className="text-muted-foreground flex items-center">
            {node.merchandise.selectedOptions.map((option, index) => (
              <div key={option.name} className="flex items-center">
                <span className="block text-sm">{option.value}</span>
                {index < node.merchandise.selectedOptions.length - 1 && (
                  <span className="block text-sm text-muted-foreground mx-2">/</span>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {unitPriceFormatted} {node.merchandise.price.currencyCode}
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center gap-4 flex-1 min-w-0 md:justify-end">
        <QuantityUpdatedContainer
          originalQuantity={node.quantity}
          quantityAvailable={node.merchandise.quantityAvailable}
          id={node.id}
          disabled={finalPrice <= 0}
        />
        <div className="flex flex-col items-end">
          <div className="text-right flex items-center gap-1">
            <p className="font-medium">{finalPrice.toFixed(2)}</p>
            <p className="font-medium">{node.merchandise.price.currencyCode}</p>
          </div>
          {finalPrice < totalPrice && (
            <p className="text-sm text-red-500 line-through">
              {totalPrice.toFixed(2)} {node.merchandise.price.currencyCode}
            </p>
          )}
        </div>

        <CartRemove id={node.id} />
      </div>
    </div>
  );
};

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
    <div className="pb-8 max-w-6xl mx-auto">
      <PageBanner title="Your Cart" className="w-full pb-4">
        <div className="flex items-center justify-between gap-2 w-full">
          <Link
            href="/"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
          <div className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span className="font-medium">{cart.totalQuantity} Items</span>
          </div>
        </div>
      </PageBanner>

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg font-medium">Cart Items</h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cart.lines.edges?.length > 0 ? (
                  cart.lines.edges.map(({ node }, index) => (
                    <div key={node.id}>
                      <LineItem node={node} />
                      {index < cart.lines.edges.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-lg text-muted-foreground">Your cart is empty</p>
                    <Link href="/" className="mt-4 text-sm hover:underline">
                      <Button variant="secondary">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                )}
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
              <CardTitle>
                <h2 className="text-lg font-medium">Order Summary</h2>
              </CardTitle>
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
                {cart.cost.totalAmount.amount < cart.cost.subtotalAmount.amount && (
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>
                      {(cart.cost.totalAmount.amount - cart.cost.subtotalAmount.amount).toFixed(2)}{' '}
                      {cart.cost.subtotalAmount.currencyCode}
                    </span>
                  </div>
                )}
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

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg font-medium">Promo Code</h2>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Enter your promo code to get a discount on your order.
              </p>
            </CardHeader>
            <CardContent>
              <CouponCodeForm discountCodes={cart.discountCodes} />
            </CardContent>
            <CardFooter>
              <DiscountCodes discountCodes={cart.discountCodes} />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
