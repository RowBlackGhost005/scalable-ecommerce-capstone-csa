import React, { useState } from 'react';
import {
  getPresignedUploadUrl,
  uploadFileToS3,
  createProduct,
} from '../api/productsAPI';

import '../styles.css'


const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { imageFile, name, description, price } = formData;

      const { uploadURL, key } = await getPresignedUploadUrl({
        fileName: imageFile.name,
        fileType: imageFile.type,
      });

      await uploadFileToS3(imageFile, uploadURL);

      await createProduct({
        name,
        description,
        price: parseFloat(price),
        imageKey: key,
      });

      setSuccessMsg('Product created successfully!');
      setFormData({
        name: '',
        description: '',
        price: '',
        imageFile: null,
      });
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-form-container">
      <h2 className="form-title">Create a New Product</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Product name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Product description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price (USD)"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          required
        />
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Product'}
        </button>
        {successMsg && <p className="success-message">{successMsg}</p>}
        {errorMsg && <p className="error-message">{errorMsg}</p>}
      </form>
    </div>
  );
};

export default ProductForm;