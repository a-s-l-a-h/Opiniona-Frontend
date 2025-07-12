// src/pages/AddProductPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

function AddProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create the product
      const productResponse = await apiClient.post('/products/', {
        name,
        description,
        price,
      });

      const newProductId = productResponse.data.id;

      // Step 2: If an image was selected, upload it
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        // Note: We use 'multipart/form-data' for file uploads
        await apiClient.post(`/products/${newProductId}/upload-image/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      // Step 3: Redirect to the new product's detail page
      navigate(`/products/${newProductId}`);

    } catch (err) {
      console.error("Failed to create product:", err.response?.data);
      setError("Failed to create product. Please check the form and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add a New Product</h2>
        <form onSubmit={handleProductSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"/>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image (Optional)</label>
            <input type="file" id="image" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-sm disabled:bg-gray-400">
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductPage;