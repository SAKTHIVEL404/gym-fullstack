
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { ShoppingBag, Star, ArrowLeft, Heart, Share2, ZoomIn } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await productsAPI.getById(id);
        
        if (!response?.data?.data) {
          throw new Error('Invalid product data');
        }

        const productData = response.data.data;
        setProduct(productData);

        // Handle images
        let productImages = [];
        const defaultImage = 'https://images.pexels.com/photos/4164762/pexels-photo-4164762.jpeg?auto=compress&cs=tinysrgb&w=800';

        if (Array.isArray(productData.images) && productData.images.length > 0) {
          productImages = [...productData.images];
        } else if (typeof productData.images === 'string') {
          try {
            const parsed = JSON.parse(productData.images);
            if (Array.isArray(parsed)) productImages = parsed;
          } catch (e) {
            console.warn('Could not parse images string:', e);
          }
        }

        if (productData.imageUrl && !productImages.includes(productData.imageUrl)) {
          productImages.unshift(productData.imageUrl);
        }

        const firstImage = productImages[0] || defaultImage;
        setMainImage(firstImage);
        setThumbnails(productImages.length > 0 ? productImages : [defaultImage]);
        setError(null);
      } catch (err) {
        console.error('Error in fetchProduct:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product?.category?.id) return;

    const fetchRelatedProducts = async () => {
      try {
        const response = await productsAPI.getAll({
          category: product.category.id,
          limit: 4,
          exclude: product.id,
        });

        const relatedProducts = response?.data?.data || [];
        setRelatedProducts(Array.isArray(relatedProducts) ? relatedProducts : []);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setRelatedProducts([]);
      }
    };

    fetchRelatedProducts();
  }, [product?.id, product?.category?.id]);

  useEffect(() => {
    if (product) {
      console.log('Current product state:', product);
      console.log('Current main image:', mainImage);
      console.log('Current thumbnails:', thumbnails);
    }
  }, [product, mainImage, thumbnails]);

  const handleAddToCart = () => {
    if (product?.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product?.colors?.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    toast.success(`${product?.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (product?.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product?.colors?.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    toast.success('Redirecting to checkout...');
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-coquelicot"></div>
        <p className="ml-4 text-[1.4rem] font-rubik">Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-[100px] text-center py-16 font-rubik text-[1.4rem] text-sonic-silver">
        <h2 className="font-catamaran text-[2.5rem] font-bold text-rich-black-fogra-29-1 mb-4">
          {error || 'Product not found'}
        </h2>
        <Link
          to="/shop"
          className="bg-coquelicot text-white px-6 py-3 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-[100px] min-h-screen bg-white font-rubik text-[1.4rem] text-sonic-silver">
      <div className="max-w-[1140px] mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-[1.4rem] text-coquelicot hover:underline transition-colors duration-300"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Product Image Section */}
          <div className="lg:col-span-2 animate-slide-in-left">
            <div className="relative group bg-gainsboro rounded-[12px] overflow-hidden mb-4">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-[450px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-coquelicot-10">
                  <ZoomIn size={20} className="text-coquelicot" />
                </button>
              </div>
            </div>
            {/* Thumbnail Carousel */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {thumbnails.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-[6px] cursor-pointer border-2 ${
                    mainImage === image ? 'border-coquelicot' : 'border-transparent'
                  } hover:border-coquelicot transition-all duration-300`}
                  onClick={() => handleThumbnailClick(image)}
                />
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-3 animate-slide-in-right">
            <div className="mb-4">
              <span className="bg-coquelicot-10 text-coquelicot px-3 py-1 rounded-[6px] text-[1.2rem] font-medium">
                {product.category?.name || 'Fitness Equipment'}
              </span>
            </div>

            <h1 className="font-catamaran text-[2.5rem] md:text-[3.5rem] font-extrabold text-rich-black-fogra-29-1 mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < (product.rating || 4) ? '#FF5733' : 'transparent'}
                    stroke="#FF5733"
                  />
                ))}
                <span className="text-[1.3rem] text-sonic-silver ml-2">
                  ({product.reviewCount || 12} reviews)
                </span>
              </div>
            </div>

            <div className="mb-5">
              <span className="font-catamaran text-[2.2rem] font-extrabold text-coquelicot">
                ₹{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-[1.5rem] text-sonic-silver line-through ml-4">
                  ₹{product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-[1.3rem] text-coquelicot ml-4">
                  ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                </span>
              )}
            </div>

            <p className="text-[1.4rem] text-sonic-silver leading-[1.8] mb-6">
              {product.description}
            </p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-catamaran text-[1.6rem] font-bold text-rich-black-fogra-29-1 mb-3">Size</h4>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 border-2 rounded-[6px] text-[1.3rem] transition-all duration-300 ${
                        selectedSize === size
                          ? 'bg-coquelicot text-white border-coquelicot'
                          : 'bg-white text-rich-black-fogra-29-1 border-light-gray hover:border-coquelicot hover:bg-coquelicot-10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h4 className="font-catamaran text-[1.6rem] font-bold text-rich-black-fogra-29-1 mb-3">Color</h4>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2 border-2 rounded-[6px] text-[1.3rem] transition-all duration-300 ${
                        selectedColor === color
                          ? 'bg-coquelicot text-white border-coquelicot'
                          : 'bg-white text-rich-black-fogra-29-1 border-light-gray hover:border-coquelicot hover:bg-coquelicot-10'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h4 className="font-catamaran text-[1.6rem] font-bold text-rich-black-fogra-29-1 mb-3">Quantity</h4>
              <div className="flex items-center gap-4">
                <div className="flex border-2 border-light-gray rounded-[6px]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-gainsboro text-rich-black-fogra-29-1 hover:bg-coquelicot-10 transition-colors duration-300"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 bg-white min-w-[60px] text-center text-[1.4rem]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-gainsboro text-rich-black-fogra-29-1 hover:bg-coquelicot-10 transition-colors duration-300"
                  >
                    +
                  </button>
                </div>
                <span className="text-[1.3rem] text-sonic-silver">
                  {product.stock || 10} in stock
                </span>
              </div>
            </div>

            {/* Sticky Action Buttons */}
            <div className="lg:sticky lg:top-[100px] bg-white p-4 rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] mb-6">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-transparent border-2 border-coquelicot text-coquelicot px-4 py-3 rounded-[8px] text-[1.4rem] hover:bg-coquelicot hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-coquelicot text-white px-4 py-3 rounded-[8px] text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                >
                  Buy Now
                </button>
              </div>
              <div className="flex gap-6 mt-4">
                <button className="flex items-center gap-2 text-[1.3rem] text-sonic-silver hover:text-coquelicot transition-colors duration-300">
                  <Heart size={20} />
                  Add to Wishlist
                </button>
                <button className="flex items-center gap-2 text-[1.3rem] text-sonic-silver hover:text-coquelicot transition-colors duration-300">
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 bg-gainsboro rounded-[10px] mb-8">
              <h4 className="font-catamaran text-[1.8rem] font-bold text-rich-black-fogra-29-1 mb-4">Product Details</h4>
              <ul className="list-none">
                <li className="mb-2 text-[1.3rem] text-sonic-silver">
                  <strong>Brand:</strong> {product.brand || 'Phoenix Fitness'}
                </li>
                <li className="mb-2 text-[1.3rem] text-sonic-silver">
                  <strong>Material:</strong> {product.material || 'High-quality materials'}
                </li>
                <li className="mb-2 text-[1.3rem] text-sonic-silver">
                  <strong>Warranty:</strong> {product.warranty || '1 Year'}
                </li>
                <li className="mb-2 text-[1.3rem] text-sonic-silver">
                  <strong>Shipping:</strong> Free shipping on orders over ₹999
                </li>
              </ul>
            </div>

            {/* Customer Reviews */}
            <div className="p-6 bg-white rounded-[10px] border border-coquelicot-20 mb-8">
              <h4 className="font-catamaran text-[1.8rem] font-bold text-rich-black-fogra-29-1 mb-4">Customer Reviews</h4>
              <div className="space-y-4">
                <div className="border-b border-light-gray pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-rubik text-[1.3rem] font-medium text-rich-black-fogra-29-1">John D.</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < 4 ? '#FF5733' : 'transparent'} stroke="#FF5733" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[1.3rem] text-sonic-silver">Great quality product! Really helps with my workouts. Highly recommend.</p>
                </div>
                <div className="border-b border-light-gray pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-rubik text-[1.3rem] font-medium text-rich-black-fogra-29-1">Priya S.</span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < 5 ? '#FF5733' : 'transparent'} stroke="#FF5733" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[1.3rem] text-sonic-silver">Amazing equipment, fast delivery, and excellent customer service!</p>
                </div>
              </div>
              <button className="mt-4 text-[1.3rem] text-coquelicot hover:underline">View all reviews</button>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mb-8">
                <h4 className="font-catamaran text-[1.8rem] font-bold text-rich-black-fogra-29-1 mb-4">Related Products</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.map((related) => (
                    <div
                      key={related.id}
                      className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300"
                    >
                      <img
                        src={related.imageUrl || 'https://images.pexels.com/photos/4164762/pexels-photo-4164762.jpeg?auto=compress&cs=tinysrgb&w=800'}
                        alt={related.name}
                        className="w-full h-[150px] object-cover rounded-t-[10px]"
                      />
                      <div className="p-4">
                        <h5 className="font-catamaran text-[1.5rem] font-bold text-rich-black-fogra-29-1 mb-2">
                          <Link to={`/product/${related.id}`} className="hover:text-coquelicot transition-colors">
                            {related.name}
                          </Link>
                        </h5>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < Math.floor(related.rating || 4) ? '#FF5733' : 'transparent'}
                              stroke="#FF5733"
                            />
                          ))}
                        </div>
                        <span className="font-catamaran text-[1.5rem] font-extrabold text-coquelicot">
                          ₹{related.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
