import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/product';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch product details.');
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full rounded-lg" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-2xl font-semibold mb-4">${product.price}</p>
          <button className="bg-blue-500 text-white py-2 px-4 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;