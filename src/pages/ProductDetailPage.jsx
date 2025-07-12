import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuthStore } from '../stores/authStore';

// --- Sub-component for the Review Form ---
function ReviewForm({ productId, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("You must be logged in to submit a review.");
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await apiClient.post(`/products/${productId}/reviews/`, { rating, feedback });
      setRating(5);
      setFeedback('');
      onReviewSubmitted();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <p className="mt-8 text-center text-gray-600 bg-gray-100 p-4 rounded-lg">
        Please <Link to="/login" className="text-teal-500 hover:underline font-semibold">log in</Link> to leave a review.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 p-6 border border-gray-200 rounded-lg bg-white">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Write a Review</h3>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <select value={rating} onChange={(e) => setRating(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
          {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Feedback</label>
        <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows="3" required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"></textarea>
      </div>
      <button type="submit" disabled={submitting} className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 disabled:bg-gray-400">
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}


// --- Main Product Detail Page Component ---
function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isStaff } = useAuthStore();

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/products/${id}/`);
      setProduct(response.data);
      setCurrentImageIndex(0); // Reset image index on new product load
    } catch (err) {
      console.error("Failed to fetch product", err);
      setError("Product not found or an error occurred.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
  
  const handleDeleteProduct = async () => {
    if (window.confirm('Are you sure you want to permanently delete this product? This action cannot be undone.')) {
      try {
        await apiClient.delete(`/products/${id}/`);
        navigate('/');
      } catch (err) {
        alert("Failed to delete product. Please try again.");
      }
    }
  };
  
  const goToNextImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };

  const goToPreviousImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) return <div className="text-center p-10 font-semibold">Loading product details...</div>;
  if (error) return <div className="text-center p-10 text-red-500 font-semibold">{error}</div>;
  if (!product) return null;
  
  const images = product.images && product.images.length > 0 ? product.images : [{ id: 'placeholder', image: 'https://via.placeholder.com/600x400' }];
  const currentImage = images[currentImageIndex]?.image;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* --- THIS IS THE CORRECTED ADMIN CONTROLS BLOCK --- */}
        {isStaff && (
          <div className="bg-yellow-100 p-3 border-b border-yellow-200 flex justify-end items-center space-x-4">
            <span className="font-bold text-yellow-800 text-sm">Admin Controls:</span>
            <Link to={`/products/${id}/edit`} className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700">Edit</Link>
            <button onClick={handleDeleteProduct} className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700">Delete</button>
          </div>
        )}

        <div className="relative">
          <img src={currentImage} alt={product.name} className="w-full h-96 object-cover" />
          {images.length > 1 && (
            <>
              <button onClick={goToPreviousImage} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full m-2 hover:bg-opacity-75 focus:outline-none">
                ❮
              </button>
              <button onClick={goToNextImage} className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full m-2 hover:bg-opacity-75 focus:outline-none">
                ❯
              </button>
            </>
          )}
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl text-teal-600 font-semibold mt-2">${product.price}</p>
          <div className="mt-4 text-yellow-500 flex items-center">
             {'★'.repeat(Math.round(product.average_rating))}{'☆'.repeat(5 - Math.round(product.average_rating))}
            <span className="text-gray-500 ml-2 text-sm">({product.average_rating.toFixed(1)} average rating from {product.reviews.length} reviews)</span>
          </div>
          <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
        <div className="mt-4 space-y-4">
          {product.reviews.length > 0 ? (
            product.reviews.map(review => (
              <div key={review.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{review.user}</p>
                   <div className="text-sm text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
                </div>
                <p className="text-gray-600 mt-2">{review.feedback}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet. Be the first to write one!</p>
          )}
        </div>
        <ReviewForm productId={id} onReviewSubmitted={fetchProduct} />
      </div>
    </div>
  );
}

export default ProductDetailPage;