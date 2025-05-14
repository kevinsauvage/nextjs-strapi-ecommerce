'use client';

import { useState } from 'react';
import { Heart, Info, ShoppingBag, Star } from 'lucide-react';

import QuantityUpdater from '@/components/QuantityUpdater';
import useUserContext from '@/contexts/UserContext/useUserContext';
import useProductSelection from '@/hooks/useProductSelection';
import type { GetProductByHandleQuery } from '@/shopify/storefront';

import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import Options from './Options';
import PhotoGallery from './PhotoGallery';

const ProductDescription = ({
  product,
  isModal,
}: {
  product: GetProductByHandleQuery['product'];
  isModal?: boolean;
}) => {
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
  const { productType, options, title, id, images } = product || {};

  const { userWishlist, handleSetWishlist } = useUserContext();
  const isWishlisted = userWishlist?.find((item) => item.id === id);
  const [activeTab, setActiveTab] = useState('details');

  const {
    quantityAvailable,
    availableForSale,
    price,
    sku,
    title: variantTitle,
    weight,
    weightUnit,
  } = selectedVariant || {};

  const handleWishlist = async () => {
    await handleSetWishlist(!!isWishlisted, product);
  };

  return (
    <div className="grid  md:grid-cols-7 relative gap-12">
      <div className="relative md:col-span-4">
        <PhotoGallery images={images.edges.map((edge) => edge.node) as unknown as ImageFields[]} />

        {availableForSale ? null : (
          <Badge
            variant="destructive"
            className="absolute right-4 top-4 px-3 py-1.5 text-sm font-medium"
          >
            Sold Out
          </Badge>
        )}

        {quantityAvailable && quantityAvailable < 5 && availableForSale ? (
          <Badge
            variant="secondary"
            className="absolute right-4 top-4 px-3 py-1.5 text-sm font-medium"
          >
            Low Stock: {quantityAvailable} left
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-col gap-6 md:col-span-3 sticky top-0">
        <div>
          <div className="mb-2 flex items-center gap-2">
            {productType && (
              <Badge variant="outline" className="text-xs font-normal">
                {productType}
              </Badge>
            )}
            <div className="ml-auto flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-primary text-primary" />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">(24 reviews)</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

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

        {isModal ? null : (
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
              {typeof product.descriptionHtml === 'string' ? (
                <div
                  className="product-description"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
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
                  options={options}
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
                  quantityAvailable={quantityAvailable}
                  productId={id}
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
            disabled={!availableForSale || quantityAvailable < quantity}
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
    </div>
  );
};

export default ProductDescription;
