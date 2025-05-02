'use client';

import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { deleteAddressAction, setDefaultAddressAction } from '@/actions/addressesActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import config from '@/config';
import type { MailingAddress } from '@/shopify/storefront';

const Address = ({
  address,
  isDefault,
  displayButton = true,
}: {
  address: MailingAddress;
  isDefault?: boolean;
  displayButton?: boolean;
}) => {
  const { id, address1, address2, name, city, country, province, zip, company, phone } =
    address || {};

  const handleDelete = async () => {
    const response = await deleteAddressAction(id);

    if (response.error) {
      return toast.error(response.error);
    }
    if (response?.customerUserErrors?.length) {
      response.customerUserErrors.forEach((error) => {
        toast.error(error.message);
      });
      return;
    }
    toast.success('Address deleted successfully');
  };

  const handleSetAsDefault = async () => {
    const response = await setDefaultAddressAction(id);

    if (response.error) {
      return toast.error(response.error);
    }

    if (response?.customerUserErrors?.length) {
      response.customerUserErrors.forEach((error) => {
        toast.error(error.message);
      });
      return;
    }
    toast.success('Address set as default successfully');
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="px-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-1">
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">
            {address1}
            {address2 && `, ${address2}`}
          </p>
          <p className="text-sm text-muted-foreground">
            {zip}, {city}
          </p>
          <p className="text-sm text-muted-foreground">
            {province}, {country}
          </p>
          {(company || phone) && (
            <div className="pt-1">
              {company && <p className="text-sm">{company}</p>}
              {phone && <p className="text-sm">{phone}</p>}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end justify-between gap-2">
          {displayButton && (
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="secondary" size="icon" asChild>
                      <Link href={`${config.routes.editAddress}?id=${id}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit address</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        handleDelete().catch((error) => {
                          console.error('Error deleting address:', error);
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove address</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove address</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {!isDefault && displayButton ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                handleSetAsDefault().catch((error) => {
                  console.error('Error setting address as default:', error);
                });
              }}
            >
              Set as default
            </Button>
          ) : isDefault ? (
            <Badge variant="secondary" className="text-xs">
              Default address
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};

export default Address;
