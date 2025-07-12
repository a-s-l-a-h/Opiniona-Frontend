// src/pages/EditProductPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ name: '', description: '', price: '' });
  const [images, setImages] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProductData = useCallback(async () => {
    try {
      const response = await apiClient.get(`/products/${id}/`);
      setProduct({
        name: response.data.name,
        description: response.data.description,
        price: response.data.price,
      });
      setImages(response.data.images || []);
    } catch (err) {
      setError('Failed to load product data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleProductUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.put(`/products/${id}/`, product);
      navigate(`/products/${id}`);
    } catch (err) {
      setError('Failed to update product details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await apiClient.delete(`/products/images/${imageId}/`);
        // Refresh the product data to show the updated image list
        fetchProductData();
      } catch (err) {
        setError('Failed to delete image.');
        console.error(err);
      }
    }
  };

  const handleImageUpload = async () => {
    if (!newImageFile) return;
    const formData = new FormData();
    formData.append('image', newImageFile);
    try {
      await apiClient.post(`/products/${id}/upload-image/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setNewImageFile(null); // Clear the file input
      document.getElementById('new-image-input').value = null; // Reset file input visually
      fetchProductData(); // Refresh data
    } catch (err) {
      setError('Failed to upload new image.');
      console.error(err);
    }
  };
  
  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Product Details</h2>
        <form onSubmit={handleProductUpdate} className="space-y-6">
          {/* Form fields for name, description, price */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input type="text" name="name" id="name" value={product.name} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={product.description} onChange={handleInputChange} rows="4" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" name="price" id="price" value={product.price} onChange={handleInputChange} required step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md shadow-sm disabled:bg-gray-400">Update Product</button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Images</h2>
        {/* Display existing images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {images.map(img => (
            <div key={img.id} className="relative group">
              <img src={img.image} alt="Product" className="w-full h-32 object-cover rounded-md"/>
              <button onClick={() => handleImageDelete(img.id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
            </div>
          ))}
        </div>
         {/* Form to upload a new image */}
        <div>
           <label htmlFor="new-image-input" className="block text-sm font-medium text-gray-700">Add New Image</label>
           <div className="flex items-center space-x-4 mt-1">
                <input type="file" id="new-image-input" onChange={(e) => setNewImageFile(e.target.files[0])} accept="image/*" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"/>
                <button onClick={handleImageUpload} disabled={!newImageFile} className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:bg-gray-400 whitespace-nowrap">Upload Image</button>
           </div>
        </div>
      </div>
    </div>
  );
}

export default EditProductPage;