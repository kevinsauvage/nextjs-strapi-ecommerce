export const initialState = {
  cart: {
    items: [],
  },
};

export const actions = {
  ADD_TO_CART: 'ADD_TO_CART',
};

export const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.ADD_TO_CART: {
      const { product, quantity } = action.payload;

      if (!product?.id) return { ...state };

      const exist = state.cart.items.find((el) => el.product.id === product.id);

      if (exist) {
        const newItems = state.cart.items.map((el) => {
          if (el.product.id === product.id)
            return {
              product,
              quantity: Number(el.quantity) + Number(quantity),
            };
          return el;
        });

        return {
          ...state,
          cart: { items: newItems },
        };
      }

      const newItems = [
        ...state.cart.items,
        {
          product,
          quantity: Number(quantity),
        },
      ];

      return {
        ...state,
        cart: { items: newItems },
      };
    }

    default:
      return state;
  }
};
