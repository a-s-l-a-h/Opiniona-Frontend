
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore'; // Import auth store

function ProductCard({ product }) {
  // ... (ProductCard component remains the same)
  const primaryImage = product.images && product.images.length > 0 ? product.images[0].image : 'https://via.placeholder.com/300';
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:-translate-y-1">
      <Link to={`/products/${product.id}`}>
        <img src={primaryImage} alt={product.name} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-gray-600 mt-1">${product.price}</p>
          <div className="mt-2 text-sm text-yellow-500">
            {'★'.repeat(Math.round(product.average_rating))}{'☆'.repeat(5 - Math.round(product.average_rating))}
            <span className="text-gray-500 ml-2">({product.average_rating.toFixed(1)})</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isStaff } = useAuthStore(); // Get admin status from the store

  // ... (useEffect hook remains the same)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/products/');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center p-10">Loading products...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        {/* ---- ADMIN-ONLY BUTTON ---- */}
        {isStaff && (
          <Link to="/add-product" className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-md shadow-sm hover:bg-teal-700">
            + Add New Product
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;