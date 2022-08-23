import { useState, useEffect } from 'react';

const useTotalItems = (items) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(items.reduce((acc, item) => acc + Number(item.quantity), 0));
  }, [items]);

  return total;
};

export default useTotalItems;
