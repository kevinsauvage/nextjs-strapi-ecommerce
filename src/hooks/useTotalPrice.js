import { useEffect, useState } from 'react';

const useTotalPrice = (items) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(
      items.reduce(
        (previousValue, el) =>
          previousValue +
          Number(el.product.price.replace(',', '.')) * Number(el.quantity),
        0
      )
    );
  }, [items]);

  return total.toFixed(2);
};

export default useTotalPrice;
