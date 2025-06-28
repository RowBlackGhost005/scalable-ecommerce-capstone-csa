import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, deleteProductById } from '../api/productsAPI';
import '../styles.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product.');
      }
    };

    loadProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductById(id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!product) return <p className="loading-message">Loading...</p>;

  return (
    <div className="product-detail-container">
      <button className="delete-button" onClick={handleDelete}>Delete</button>
      <div className="detail-image-container">
        <img src={product.image_url} alt={product.name} className="detail-image" />
      </div>
      <h2 className="detail-title">{product.name}</h2>
      <p className="detail-description">{product.description}</p>
      <p className="detail-price">${product.price}</p>
    </div>
  );
};

export default ProductDetails;