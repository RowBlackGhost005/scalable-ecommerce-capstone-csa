import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api/productsAPI';
import ProductItem from '../components/ProductItem';

import '../styles.css'

const ProductList = ({ onProductClick }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load products.');
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="product-list-container">
      <h2 className="list-title">Products</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="product-grid">
        {products.map((product) => (
          <ProductItem key={product.id} product={product}/>
        ))}
      </div>
    </div>
  );
};

export default ProductList;