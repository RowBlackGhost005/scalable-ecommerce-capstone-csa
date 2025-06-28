import React from 'react';

import '../styles.css'

const ProductItem = ({ product, onClick }) => {
  const { id , name, description, price, image_url } = product;

  return (
    <div className="product-card" onClick={() => onClick(product)}>
      <div className="product-image-container">
        <img src={image_url} alt={name} className="product-image" />
      </div>
      <h3 className="product-title">{name}</h3>
      <p className="product-description">{description}</p>
      <p className="product-price">${price}</p>
    </div>
  );
};

export default ProductItem;