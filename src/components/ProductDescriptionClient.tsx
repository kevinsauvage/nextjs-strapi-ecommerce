'use client';

import { Heart, Info, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

import QuantityUpdater from '@/components/QuantityUpdater';
import useUserContext from '@/contexts/UserContext/useUserContext';
import useProductSelection from '@/hooks/useProductSelection';
import type { GetProductByHandleQuery } from '@/shopify/storefront';

import Options from './Options';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type ProductDescriptionClientProps = {
  product: NonNullable<GetProductByHandleQuery['product']>;
  isModal?: boolean;
  defaultVariant: {
    quantityAvailable?: number | null;
    availableForSale?: boolean;
    price?: { amount: string; currencyCode: string } | null | undefined;
    sku?: string | null;
    title?: string;
    weight?: number | null;
    weightUnit?: string;
  };
  descriptionHtml: string;
  productId: string;
};

const ProductDescriptionClient = ({
  product,
  isModal,
  defaultVariant,
  descriptionHtml,
  productId,
}: ProductDescriptionClientProps) => {
  const {
    handleAddToCart,
    selectedVariant,
    totalPrice,
    handleSetSelectedProductOption,
    quantity,
    handleChangeInput,
    isOptionSelected,
    isOptionOutOfStock,
  } = useProductSelection({ product });
  const { userWishlist, handleSetWishlist } = useUserContext();
  const [activeTab, setActiveTab] = useState('details');

  const isWishlisted = userWishlist?.find((item) => item.id === productId);

  const selectedVariantData = selectedVariant as
    | {
        quantityAvailable?: number | null;
        availableForSale?: boolean;
        price?: { amount: string; currencyCode: string };
        sku?: string | null;
        title?: string;
        weight?: number | null;
        weightUnit?: string;
      }
    | undefined;

  const {
    quantityAvailable,
    availableForSale,
    price,
    sku,
    title: variantTitle,
    weight,
    weightUnit,
  } = selectedVariantData || defaultVariant;

  const handleWishlist = async () => {
    await handleSetWishlist(!!isWishlisted, product);
  };

  return (
    <div className="flex flex-col gap-6 md:col-span-3 sticky top-0">
      <div>
        <div className="mb-2 flex items-center gap-2">
          {product.productType && (
            <Badge variant="outline" className="text-xs font-normal">
              {product.productType}
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold">
            {price?.currencyCode} {price?.amount}
          </span>
          {quantity > 1 && (
            <span className="text-sm text-muted-foreground">
              Total: {price?.currencyCode} {totalPrice}
            </span>
          )}
        </div>
      </div>

      <Separator />

      {!isModal && (
        <Tabs
          defaultValue="details"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-4">
            {descriptionHtml ? (
              <div
                className="product-description"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                Experience premium quality and exceptional design with this product. Perfect for
                everyday use and special occasions alike.
              </p>
            )}
          </TabsContent>
          <TabsContent value="specs" className="mt-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {sku && (
                <div className="flex justify-between gap-2">
                  <span className="font-medium">SKU:</span>
                  <span className="text-muted-foreground">{sku}</span>
                </div>
              )}
              {variantTitle && (
                <div className="flex justify-between gap-2">
                  <span className="font-medium">Variant:</span>
                  <span className="text-muted-foreground">{variantTitle}</span>
                </div>
              )}
              {weight && (
                <div className="flex justify-between gap-2">
                  <span className="font-medium">Weight:</span>
                  <span className="text-muted-foreground">{`${weight} ${weightUnit?.toLowerCase()}`}</span>
                </div>
              )}
              {quantityAvailable !== undefined && (
                <div className="flex justify-between gap-2">
                  <span className="font-medium">Available:</span>
                  <span className="text-muted-foreground">{quantityAvailable}</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Options
                options={product.options || []}
                onClick={handleSetSelectedProductOption}
                isOptionSelected={isOptionSelected}
                isOptionOutOfStock={isOptionOutOfStock}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-start gap-2">
                <h3 className="text-sm font-medium">Quantity:</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum {quantityAvailable} units available</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <QuantityUpdater
                originalQuantity={quantity || 1}
                quantityAvailable={quantityAvailable ?? 0}
                productId={productId}
                disabled={!availableForSale}
                onChange={(_id, q) => {
                  handleChangeInput(q);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          className="flex-1 gap-2"
          size="lg"
          disabled={!availableForSale || (quantityAvailable ?? 0) < quantity}
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-5 w-5" color="currentColor" />
          {availableForSale ? 'Add to Cart' : 'Sold Out'}
        </Button>

        <Button
          variant={isWishlisted ? 'default' : 'outline'}
          size="lg"
          className="gap-2"
          onClick={() => {
            handleWishlist().catch((error) => console.error(error));
          }}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-primary-foreground' : ''}`} />
          <span className="sr-only md:not-sr-only">{isWishlisted ? 'Saved' : 'Save'}</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductDescriptionClient;

