import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles.css'

const ProductItem = ({ product }) => {
  const { id , name, description, price, image_url } = product;

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };


  return (
    <div className="product-card" onClick={handleClick}>
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