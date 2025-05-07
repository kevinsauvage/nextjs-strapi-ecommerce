'use client';

import { Edit, Heart, MoreVerticalIcon, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { deleteAddressAction, setDefaultAddressAction } from '@/actions/addressesActions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                  size="icon"
                >
                  <MoreVerticalIcon />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <DropdownMenuItem>
                  <Link
                    href={`${config.routes.editAddress}?id=${id}`}
                    className="flex items-center gap-2"
                  >
                    <Edit size={16} />
                    <span>Edit address</span>
                  </Link>
                </DropdownMenuItem>
                {!isDefault && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                      handleSetAsDefault().catch((error) => {
                        console.error('Error setting address as default:', error);
                      });
                    }}
                  >
                    <Heart size={16} />
                    <span>Set as default</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    handleDelete().catch((error) => {
                      console.error('Error deleting address:', error);
                    });
                  }}
                >
                  <Trash2 size={16} />
                  <span className="whitespace-nowrap">Remove address</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isDefault && (
            <Badge variant="outline" className="text-xs">
              Default address
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Address;
