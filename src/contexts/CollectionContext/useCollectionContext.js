import { useContext } from 'react';

import { CollectionContext } from './CollectionContext';

const useCollectionContext = () => useContext(CollectionContext);

export default useCollectionContext;
