'use client';

import { useTranslations } from 'next-intl';

import Link from '@/components/LocalizedLink';
import config from '@/config';
import useProductSelection from '@/hooks/useProductSelection';
import type { ProductVariantView } from '@/hooks/useProductVariantView';
import useProductVariantView from '@/hooks/useProductVariantView';
import type { GetProductByHandleQuery } from '@/shopify/storefront';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/format';
import { isLowStock, isSoldOut } from '@/utils/inventory';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import Options from './Options';
import ProductActions from './ProductActions';
import ProductPrice from './ProductPrice';
import QuantityStepper from './QuantityStepper';

import { RotateCcw, ShieldCheck } from 'lucide-react';

type ProductDescriptionClientProps = {
  product: NonNullable<GetProductByHandleQuery['product']>;
  isModal?: boolean;
  defaultVariant: ProductVariantView;
  descriptionHtml: string;
  productId: string;
  sizeChart: SizeChart | null;
};

type SizeChart = { title: string | null; html: string; note: string | null };

const MetaItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-1">
    <dt className="text-label-sm text-muted">{label}</dt>
    <dd className="text-secondary">{value}</dd>
  </div>
);

const AvailabilityLine = ({
  availableForSale,
  quantityAvailable,
  unavailable,
}: {
  availableForSale?: boolean;
  quantityAvailable?: number | null;
  unavailable?: boolean;
}) => {
  const t = useTranslations('product');
  const soldOut = isSoldOut(availableForSale);
  const lowStock = isLowStock(quantityAvailable, availableForSale);

  const label = unavailable
    ? t('unavailableCombination')
    : soldOut
      ? t('soldOut')
      : lowStock
        ? t('leftCount', { count: quantityAvailable ?? 0 })
        : t('inStock');

  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 text-body-sm font-medium',
        unavailable || soldOut ? 'text-muted' : lowStock ? 'text-destructive' : 'text-secondary',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full bg-current',
          !unavailable && !soldOut && !lowStock && 'animate-pulse-subtle',
        )}
      />
      {label}
    </p>
  );
};

const VendorEyebrow = ({
  vendor,
  productType,
}: {
  vendor?: string | null;
  productType?: string | null;
}) => {
  if (!vendor && !productType) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {vendor ? <span className="text-eyebrow">{vendor}</span> : null}
      {vendor && productType ? (
        <span className="text-muted" aria-hidden="true">
          ·
        </span>
      ) : null}
      {productType ? <span className="text-eyebrow text-muted">{productType}</span> : null}
    </div>
  );
};

type PriceHeaderProps = {
  title: string;
  price?: { amount: string; currencyCode: string } | null;
  compareAtPrice?: { amount: string; currencyCode: string } | null;
  hasDiscount: boolean;
  quantity: number;
  totalPrice: number;
  availableForSale?: boolean;
  quantityAvailable?: number | null;
  unavailable: boolean;
};

const PriceHeader = ({
  title,
  price,
  compareAtPrice,
  hasDiscount,
  quantity,
  totalPrice,
  availableForSale,
  quantityAvailable,
  unavailable,
}: PriceHeaderProps) => {
  const t = useTranslations('product');

  return (
    <div className="space-y-4">
      <h1 className="text-heading-2">{title}</h1>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <ProductPrice
            price={price}
            compareAtPrice={compareAtPrice}
            hasDiscount={hasDiscount}
            priceClassName="text-heading-3 font-semibold tabular-nums text-foreground"
            compareAtPriceClassName="text-body text-muted line-through tabular-nums"
          />
          {hasDiscount ? <Badge variant="destructive">{t('sale')}</Badge> : null}
        </div>
        {quantity > 1 && price ? (
          <span className="text-body-sm text-secondary">
            {t('total')}: {formatPrice(totalPrice, price.currencyCode)}
          </span>
        ) : null}
        <AvailabilityLine
          availableForSale={availableForSale}
          quantityAvailable={quantityAvailable}
          unavailable={unavailable}
        />
      </div>
    </div>
  );
};

const DetailsAccordion = ({
  descriptionHtml,
  sku,
  variantTitle,
  weight,
  weightUnit,
  quantityAvailable,
  sizeChart,
}: {
  descriptionHtml: string;
  sku?: string | null;
  variantTitle?: string;
  weight?: number | null;
  weightUnit?: string | null;
  quantityAvailable?: number | null;
  sizeChart: SizeChart | null;
}) => {
  const t = useTranslations('product');

  return (
    <Accordion type="single" collapsible defaultValue="details" className="w-full">
      <AccordionItem value="details">
        <AccordionTrigger className="text-label hover:no-underline">
          {t('description')}
        </AccordionTrigger>
        <AccordionContent>
          {descriptionHtml ? (
            // Sanitized upstream in `ProductDescription` via `sanitizeHtmlCached`.
            <div
              className="product-description max-w-none text-secondary"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          ) : (
            <p className="text-body text-secondary">{t('descriptionFallback')}</p>
          )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="specs">
        <AccordionTrigger className="text-label hover:no-underline">
          {t('specifications')}
        </AccordionTrigger>
        <AccordionContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {sku ? <MetaItem label={t('sku')} value={sku} /> : null}
            {variantTitle ? <MetaItem label={t('variant')} value={variantTitle} /> : null}
            {weight ? (
              <MetaItem
                label={t('weight')}
                value={`${weight} ${weightUnit?.toLowerCase() ?? ''}`.trim()}
              />
            ) : null}
            {quantityAvailable !== null && quantityAvailable !== undefined ? (
              <MetaItem label={t('available')} value={`${quantityAvailable} ${t('units')}`} />
            ) : null}
          </dl>
        </AccordionContent>
      </AccordionItem>
      {sizeChart?.html ? (
        <AccordionItem value="size-chart">
          <AccordionTrigger className="text-label hover:no-underline">
            {sizeChart.title ?? t('sizeChart')}
          </AccordionTrigger>
          <AccordionContent>
            {/* Sanitized upstream in `ProductDescription` via `sanitizeHtmlCached`. */}
            <div
              className="product-description max-w-none text-secondary"
              dangerouslySetInnerHTML={{ __html: sizeChart.html }}
            />
            {sizeChart.note ? (
              <p className="mt-3 text-caption-sm text-muted">{sizeChart.note}</p>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      ) : null}
    </Accordion>
  );
};

const ProductDescriptionClient = ({
  product,
  isModal,
  defaultVariant,
  descriptionHtml,
  productId,
  sizeChart,
}: ProductDescriptionClientProps) => {
  const t = useTranslations('product');
  const tFooter = useTranslations('footer');
  const {
    handleAddToCart,
    selectedVariant,
    totalPrice,
    handleSetSelectedProductOption,
    quantity,
    handleChangeInput,
    isAdding,
    isOptionSelected,
    isOptionOutOfStock,
    isSelectionUnavailable,
  } = useProductSelection({ product });

  const {
    quantityAvailable,
    availableForSale,
    price,
    compareAtPrice,
    sku,
    title: variantTitle,
    weight,
    weightUnit,
    quantityCap,
    hasDiscount,
  } = useProductVariantView(selectedVariant, defaultVariant);

  return (
    <div className="flex flex-col gap-8 lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
      <div className="space-y-4">
        <VendorEyebrow vendor={product.vendor} productType={product.productType} />

        <PriceHeader
          title={product.title}
          price={price}
          compareAtPrice={compareAtPrice}
          hasDiscount={hasDiscount}
          quantity={quantity}
          totalPrice={totalPrice}
          availableForSale={availableForSale}
          quantityAvailable={quantityAvailable}
          unavailable={isSelectionUnavailable}
        />
      </div>

      <Separator className="bg-border/70" />

      {!isModal && (
        <DetailsAccordion
          descriptionHtml={descriptionHtml}
          sku={sku}
          variantTitle={variantTitle}
          weight={weight}
          weightUnit={weightUnit}
          quantityAvailable={quantityAvailable}
          sizeChart={sizeChart}
        />
      )}

      <div className="rounded-[var(--radius)] border border-border/70 bg-card p-5 md:p-6">
        <div className="space-y-6">
          {product.options && product.options.length > 0 ? (
            <Options
              options={product.options}
              onClick={handleSetSelectedProductOption}
              isOptionSelected={isOptionSelected}
              isOptionOutOfStock={isOptionOutOfStock}
            />
          ) : null}

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-label">{t('quantity')}</h2>
              {quantityAvailable !== null && quantityAvailable !== undefined ? (
                <span className="text-caption-sm text-muted">
                  {t('availableCount', { count: quantityAvailable })}
                </span>
              ) : null}
            </div>
            <QuantityStepper
              quantity={quantity}
              onChange={handleChangeInput}
              quantityAvailable={quantityAvailable}
              disabled={!availableForSale || isSelectionUnavailable}
            />
          </div>

          <ProductActions
            productId={productId}
            availableForSale={!!availableForSale}
            disabled={quantityCap !== undefined && quantity > quantityCap}
            loading={isAdding}
            onAddToCart={handleAddToCart}
            unavailable={isSelectionUnavailable}
          />
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-caption-sm text-secondary">
        <li className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          {tFooter('secureCheckout')}
        </li>
        <li className="inline-flex items-center gap-2">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <Link href={config.routes.refund} className="link-underline">
            {t('returnsAndRefunds')}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default ProductDescriptionClient;
