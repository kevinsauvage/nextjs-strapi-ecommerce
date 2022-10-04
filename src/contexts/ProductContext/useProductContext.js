import { ProductContext } from './ProductContext';

const { useContext } = require('react');

const useProductContext = () => useContext(ProductContext);

export default useProductContext;
