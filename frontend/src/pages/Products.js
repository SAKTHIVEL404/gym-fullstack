import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../api/product';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch products.');
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="text-gray-700 mb-2">{product.description}</p>
            <p className="text-lg font-semibold">${product.price}</p>
            <Link to={`/products/${product.id}`} className="text-blue-500 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;