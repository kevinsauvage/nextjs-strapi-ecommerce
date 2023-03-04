import { useContext } from 'react';

import { GlobalStoreContext } from './GlobalContext';

const useGlobalContext = () => useContext(GlobalStoreContext);

export default useGlobalContext;
