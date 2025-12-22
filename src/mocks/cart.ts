import { type CartFieldsFragment, CurrencyCode } from '@/shopify/storefront';

const cartMock: CartFieldsFragment = {
  __typename: 'Cart',
  id: '',
  createdAt: '',
  updatedAt: '',
  checkoutUrl: '',
  totalQuantity: 0,
  note: null,
  appliedGiftCards: [],
  lines: {
    __typename: 'BaseCartLineConnection',
    edges: [],
    pageInfo: {
      __typename: 'PageInfo',
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  },
  attributes: [],
  cost: {
    __typename: 'CartCost',
    totalAmount: {
      __typename: 'MoneyV2',
      amount: '0.00',
      currencyCode: CurrencyCode.Usd,
    },
    subtotalAmount: {
      __typename: 'MoneyV2',
      amount: '0.00',
      currencyCode: CurrencyCode.Usd,
    },
    totalTaxAmount: {
      __typename: 'MoneyV2',
      amount: '0.00',
      currencyCode: CurrencyCode.Usd,
    },
    totalDutyAmount: {
      __typename: 'MoneyV2',
      amount: '0.00',
      currencyCode: CurrencyCode.Usd,
    },
  },
  discountCodes: [],
  buyerIdentity: {
    __typename: 'CartBuyerIdentity',
    email: null,
    phone: null,
    countryCode: null,
    customer: null,
    deliveryAddressPreferences: [],
  },
};

export default cartMock;
