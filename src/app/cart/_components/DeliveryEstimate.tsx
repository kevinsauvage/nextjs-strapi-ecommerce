'use client';

import { useState } from 'react';

import CardHeaderPattern from '@/components/CardHeaderPattern';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useCartContext from '@/contexts/CartContext/useCartContext';
import type { DeliveryMethodType } from '@/shopify/storefront';
import { cn } from '@/utils/cn';
import { formatPrice } from '@/utils/format';

import { MapPin, Package, Store, Truck } from 'lucide-react';

type CountryOption = { code: string; name: string };

type DeliveryEstimateProps = {
  /** Shippable countries from Shopify localization; empty when unavailable. */
  countries: CountryOption[];
};

const METHOD_ICON: Partial<Record<DeliveryMethodType, typeof Truck>> = {
  PICKUP_POINT: Package,
  PICK_UP: Store,
  SHIPPING: Truck,
};

/**
 * Cart delivery estimator. The shopper gives a country + postal code; Shopify
 * prices the cart against that address and returns the shipping/pickup options,
 * which the shopper then picks. Backed by the modern `cart.deliveryGroups` API —
 * no deprecated buyer-identity delivery address.
 */
const DeliveryEstimate = ({ countries }: DeliveryEstimateProps) => {
  const {
    cart,
    removeDeliveryAddress,
    updateDeliveryAddress,
    updateDeliveryPreference,
    updateSelectedDeliveryOption,
  } = useCartContext();

  const [country, setCountry] = useState(countries[0]?.code ?? '');
  const [postal, setPostal] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  if (!cart) return null;

  const buyerCountry = cart.buyerIdentity?.countryCode ?? '';
  const effectiveCountry = country || buyerCountry;
  const selectedAddress = cart.delivery.addresses.find((address) => address.selected) ?? null;
  const groups = cart.deliveryGroups.edges.map((edge) => edge.node);
  const showForm = !selectedAddress || isEditing;

  const run = async (action: () => Promise<void>) => {
    setIsBusy(true);
    try {
      await action();
    } finally {
      setIsBusy(false);
    }
  };

  const handleEstimate = () =>
    run(async () => {
      const zip = postal.trim();
      if (!zip || !effectiveCountry) return;

      await updateDeliveryAddress({ countryCode: effectiveCountry, zip });
      setIsEditing(false);
    });

  const handleSelectOption = (
    deliveryGroupId: string,
    deliveryOptionHandle: string,
    type: DeliveryMethodType,
  ) =>
    run(async () => {
      await updateSelectedDeliveryOption([{ deliveryGroupId, deliveryOptionHandle }]);

      // Mirror the choice into the buyer's delivery preference so checkout
      // opens on the same method (shipping / local pickup / pickup point).
      if (type === 'SHIPPING' || type === 'PICK_UP' || type === 'PICKUP_POINT') {
        await updateDeliveryPreference({ deliveryMethod: [type] });
      }
    });

  const handleClear = () => {
    if (!selectedAddress) return;

    return run(async () => {
      await removeDeliveryAddress(selectedAddress.id);
      setPostal('');
      setIsEditing(true);
    });
  };

  return (
    <Card>
      <CardHeaderPattern
        className="pb-4 md:pb-6"
        size={4}
        title={
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-secondary" />
            Delivery estimate
          </span>
        }
        description="Estimate shipping or pickup before checkout."
      />
      <CardContent className="space-y-4" aria-busy={isBusy}>
        {showForm ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {countries.length > 0 ? (
                <div className="space-y-2">
                  <Label htmlFor="delivery-country">Country</Label>
                  <select
                    id="delivery-country"
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/40 h-9 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus-visible:ring-2 disabled:opacity-50"
                    value={country || buyerCountry}
                    disabled={isBusy}
                    onChange={(event) => setCountry(event.target.value)}
                  >
                    {countries.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="delivery-postal">Postal code</Label>
                <Input
                  id="delivery-postal"
                  value={postal}
                  autoComplete="postal-code"
                  placeholder="90210"
                  disabled={isBusy}
                  onChange={(event) => setPostal(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleEstimate().catch(() => {
                        // Context surfaces the failure as a toast.
                      });
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                loading={isBusy}
                onClick={() => {
                  handleEstimate().catch(() => {
                    // Context surfaces the failure as a toast.
                  });
                }}
              >
                Calculate
              </Button>
              {isEditing && selectedAddress ? (
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isBusy}
                  onClick={() => {
                    handleClear();
                  }}
                >
                  Clear
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
            <span className="text-body-sm text-secondary">
              {selectedAddress.address.zip}
              {selectedAddress.address.countryCode
                ? ` · ${selectedAddress.address.countryCode}`
                : ''}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isBusy}
              onClick={() => setIsEditing(true)}
            >
              Change
            </Button>
          </div>
        )}

        {groups.map((group) => (
          <fieldset key={group.id} className="space-y-2">
            <legend className="text-body-sm font-medium">Delivery method</legend>
            {group.deliveryOptions.map((option) => {
              const Icon = METHOD_ICON[option.deliveryMethodType] ?? Truck;
              const checked = group.selectedDeliveryOption?.handle === option.handle;

              return (
                <label
                  key={option.handle}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-body-sm transition-colors',
                    checked ? 'border-[var(--gold)] bg-[var(--gold-soft)]/40' : 'border-border/70',
                  )}
                >
                  <input
                    type="radio"
                    name={`delivery-group-${group.id}`}
                    className="accent-[var(--gold)]"
                    checked={checked}
                    disabled={isBusy}
                    onChange={() => {
                      handleSelectOption(group.id, option.handle, option.deliveryMethodType).catch(
                        () => {
                          // Context surfaces the failure as a toast.
                        },
                      );
                    }}
                  />
                  <Icon className="size-4 shrink-0 text-secondary" aria-hidden="true" />
                  <span className="flex-1">
                    <span className="block font-medium">{option.title ?? 'Delivery'}</span>
                    {option.description ? (
                      <span className="block text-caption text-secondary">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                  <span className="tabular-nums">
                    {formatPrice(option.estimatedCost.amount, option.estimatedCost.currencyCode)}
                  </span>
                </label>
              );
            })}
          </fieldset>
        ))}

        {!showForm && groups.length === 0 ? (
          <p className="text-caption text-secondary">
            No delivery options are available for this address yet — you can still continue to
            checkout.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default DeliveryEstimate;
