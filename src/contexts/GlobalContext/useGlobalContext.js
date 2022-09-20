const { useContext } = require('react');
const { GlobalStoreContext } = require('./GlobalContext');

const useGlobalContext = () => useContext(GlobalStoreContext);

export default useGlobalContext;
