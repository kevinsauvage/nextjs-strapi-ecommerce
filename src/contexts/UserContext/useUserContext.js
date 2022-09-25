import { UserContext } from './UserContext';

const { useContext } = require('react');

const useUserContext = () => useContext(UserContext);

export default useUserContext;
