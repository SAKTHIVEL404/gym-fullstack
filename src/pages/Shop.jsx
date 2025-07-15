
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import { ShoppingBag, Filter, Search, Star, X, Minus, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500); // Debounce API calls
    fetchCategories();
    return () => clearTimeout(timer);
  }, [selectedCategory, searchTerm, sortBy, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        search: searchTerm.trim(),
        sortBy,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      };
      const response = await productsAPI.getAll(params);
      const data = response.data;
      console.log('Products API Response:', data); // Debug
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
        toast.error('Invalid product data received');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      const data = response.data;
      console.log('Categories API Response:', data); // Debug
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && Array.isArray(data.items)) {
        setCategories(data.items);
      } else {
        setCategories([]);
        console.warn('Categories data is not an array, setting to empty array');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
      toast.error('Failed to fetch categories');
    }
  };

  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-coquelicot"></div>
      </div>
    );
  }

  return (
    <div className="pt-[100px] min-h-screen bg-white font-rubik text-[1.4rem] text-sonic-silver relative">
      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed right-6 top-24 bg-coquelicot text-white p-3 rounded-full shadow-lg z-30 flex items-center justify-center hover:bg-rich-black-fogra-29-1 transition-all duration-300"
      >
        <ShoppingBag size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-coquelicot w-6 h-6 rounded-full flex items-center justify-center text-[1.1rem] font-bold">
            {getTotalItems()}
          </span>
        )}
      </button>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] transform transition-transform duration-300 z-50 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-catamaran text-[2rem] font-bold text-rich-black-fogra-29-1">
              Your Cart ({getTotalItems()})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-sonic-silver hover:text-coquelicot transition-colors duration-300"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-[1.4rem] text-sonic-silver">Your cart is empty</p>
                <Link
                  to="/shop"
                  className="mt-4 inline-block bg-coquelicot text-white px-6 py-2 rounded-[8px] text-[1.3rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border-b border-light-gray">
                    <img
                      src={
                        item.imageUrl ||
                        'https://images.pexels.com/photos/4164762/pexels-photo-4164762.jpeg?auto=compress&cs=tinysrgb&w=800'
                      }
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-[6px]"
                    />
                    <div className="flex-1">
                      <h3 className="font-catamaran text-[1.4rem] font-medium text-rich-black-fogra-29-1">
                        {item.name}
                      </h3>
                      <p className="font-catamaran text-[1.4rem] font-bold text-coquelicot">
                        ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="p-1 text-sonic-silver hover:text-coquelicot transition-colors duration-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="mx-3 w-8 text-center text-[1.3rem]">{item.quantity || 1}</span>
                        <button
                          onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="p-1 text-sonic-silver hover:text-coquelicot transition-colors duration-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sonic-silver hover:text-red-500 transition-colors duration-300"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="border-t border-light-gray pt-4">
              <div className="flex justify-between mb-4 text-[1.4rem]">
                <span className="font-medium">Total:</span>
                <span className="font-catamaran font-bold text-coquelicot">₹{getTotalPrice().toFixed(2)}</span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-coquelicot text-white py-3 rounded-[8px] text-[1.4rem] font-rubik hover:bg-rich-black-fogra-29-1 transition-all duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay when cart is open */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <div className="max-w-[1140px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-coquelicot font-catamaran text-[1.6rem] font-bold">Fitness Shop</p>
          <h1 className="font-catamaran text-[2.5rem] md:text-[4rem] font-extrabold text-rich-black-fogra-29-1 mb-3">
            Premium Fitness Products & Apparel
          </h1>
          <p className="text-[1.4rem] text-sonic-silver max-w-[700px] mx-auto">
            Discover our collection of high-quality fitness equipment, supplements, and athletic wear
            to support your fitness journey.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gainsboro rounded-[10px] p-5 mb-8 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[250px]">
            <Search size={20} className="text-coquelicot" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-light-gray rounded-[6px] text-[1.3rem] focus:outline-none focus:border-coquelicot transition-colors duration-300"
            />
          </div>
          <div className="flex items-center gap-2 min-w-[180px]">
            <Filter size={20} className="text-coquelicot" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-light-gray rounded-[6px] text-[1.3rem] focus:outline-none focus:border-coquelicot transition-colors duration-300"
            >
              <option value="">All Categories</option>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
          </div>
          <div className="min-w-[150px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-light-gray rounded-[6px] text-[1.3rem] focus:outline-none focus:border-coquelicot transition-colors duration-300"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
          <div className="flex items-center gap-2 min-w-[200px]">
            <span className="text-[1.3rem] font-medium">Price Range:</span>
            <input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
              placeholder="Min"
              className="w-20 px-2 py-2 border border-light-gray rounded-[6px] text-[1.3rem] focus:outline-none focus:border-coquelicot"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 10000])}
              placeholder="Max"
              className="w-20 px-2 py-2 border border-light-gray rounded-[6px] text-[1.3rem] focus:outline-none focus:border-coquelicot"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Array.isArray(products) && products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300 animate-slide-in-up"
              >
                <div className="relative">
                  <img
                    src={
                      product.imageUrl ||
                      'https://images.pexels.com/photos/4164762/pexels-photo-4164762.jpeg?auto=compress&cs=tinysrgb&w=600'
                    }
                    alt={product.name}
                    className="w-full h-[200px] object-cover rounded-t-[10px]"
                  />
                  {product.discount && (
                    <span className="absolute top-3 right-3 bg-coquelicot text-white px-2 py-1 rounded-[6px] text-[1.1rem] font-medium">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-catamaran text-[1.6rem] font-bold text-rich-black-fogra-29-1 mb-2">
                    <Link to={`/product/${product.id}`} className="hover:text-coquelicot transition-colors duration-300">
                      {product.name}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < (product.rating || 4) ? '#FF5733' : 'transparent'}
                        stroke="#FF5733"
                      />
                    ))}
                    <span className="text-[1.2rem] text-sonic-silver ml-2">
                      ({product.reviewCount || 12} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-catamaran text-[1.6rem] font-extrabold text-coquelicot">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[1.3rem] text-sonic-silver line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-coquelicot text-white px-4 py-2 rounded-[8px] text-[1.3rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={16} />
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${product.id}`}
                      className="flex-1 bg-transparent border border-coquelicot text-coquelicot px-4 py-2 rounded-[8px] text-[1.3rem] hover:bg-coquelicot hover:text-white transition-all duration-300 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <ShoppingBag size={64} className="text-coquelicot mx-auto mb-4" />
              <h3 className="font-catamaran text-[2rem] font-bold text-rich-black-fogra-29-1 mb-2">
                No Products Found
              </h3>
              <p className="text-[1.4rem] text-sonic-silver">
                Try adjusting your search criteria or browse all categories.
              </p>
            </div>
          )}
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="font-catamaran text-[2.5rem] font-extrabold text-rich-black-fogra-29-1 text-center mb-6">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300 cursor-pointer animate-slide-in-up"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <img
                    src={
                      category.imageUrl ||
                      'https://images.pexels.com/photos/4164762/pexels-photo-4164762.jpeg?auto=compress&cs=tinysrgb&w=600'
                    }
                    alt={category.name}
                    className="w-full h-[150px] object-cover rounded-t-[10px]"
                  />
                  <div className="p-4">
                    <h3 className="font-catamaran text-[1.6rem] font-bold text-rich-black-fogra-29-1 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-[1.3rem] text-sonic-silver line-clamp-2">
                      {category.description || 'Explore our range of products in this category.'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[1.4rem] text-sonic-silver">
                No categories available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
