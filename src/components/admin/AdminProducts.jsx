import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../../services/api';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
    stock: '',
    brand: '',
    material: '',
    warranty: ''
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const params = {
        search: searchTerm,
        category: selectedCategory
      };
      const response = await productsAPI.getAll(params);
      const apiResp = response.data;
      setProducts(apiResp.data || []);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      const apiResp = response.data;
      setCategories(apiResp.data || []);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload converting empty strings to null and numbers correctly
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      price: formData.price ? parseFloat(formData.price) : null,
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      imageUrl: formData.imageUrl.trim() || null,
      stock: formData.stock ? parseInt(formData.stock, 10) : null,
      brand: formData.brand.trim() || null,
      material: formData.material.trim() || null,
      warranty: formData.warranty.trim() || null,
    };

    if (!payload.name || !payload.price || !payload.categoryId) {
      toast.error('Name, Price and Category are required');
      return;
    }

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.id, payload);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(payload);
        toast.success('Product created successfully');
      }
      
      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        imageUrl: '',
        stock: '',
        brand: '',
        material: '',
        warranty: ''
      });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
      imageUrl: product.imageUrl || '',
      stock: product.stock || '',
      brand: product.brand || '',
      material: product.material || '',
      warranty: product.warranty || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await categoriesAPI.create(categoryForm);
      toast.success('Category created');
      setCategoryForm({ name: '', description: '' });
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryForm({
      ...categoryForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-coquelicot"></div>
      </div>
    );
  }

  return (
    <section className="py-[80px] px-4 bg-white font-rubik text-[1.6rem] text-sonic-silver leading-[1.6]">
      <div className="max-w-[1140px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-[30px]">
          <h2 className="font-catamaran text-[2.5rem] md:text-[4.5rem] font-extrabold text-rich-black-fogra-29-1 leading-[1.2]">
            Products Management
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-coquelicot text-white px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] flex items-center gap-2 hover:bg-rich-black-fogra-29-1 transition-all duration-300"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-5 mb-[30px] p-5 bg-gainsboro rounded-[10px] border border-coquelicot-20">
          <div className="flex items-center gap-3 flex-1">
            <Search size={20} className="text-coquelicot" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver w-full focus:outline-none focus:border-coquelicot"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-coquelicot" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver min-w-[150px] focus:outline-none focus:border-coquelicot"
            >
              <option value="">All Categories</option>
              {(Array.isArray(categories) ? categories : []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300">
          <div className="p-6 bg-gainsboro rounded-b-[10px]">
            <div className="overflow-x-auto">
              <table className="w-full text-[1.4rem] border-collapse">
                <thead>
                  <tr className="border-b-2 border-light-gray">
                    <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">Image</th>
                    <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">Name</th>
                    <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">Category</th>
                    <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">Price</th>
                    <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">Stock</th>
                    <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(products) ? products : []).map((product) => (
                    <tr key={product.id} className="border-b border-light-gray hover:bg-coquelicot-10">
                      <td className="p-4">
                        <img
                          src={product.imageUrl || 'https://images.pexels.com/photos/4164762/pexels-photo-4164762.jpeg?auto=compress&cs=tinysrgb&w=100'}
                          alt={product.name}
                          className="w-[50px] h-[50px] object-cover rounded-[5px]"
                        />
                      </td>
                      <td className="p-4 font-catamaran font-medium text-rich-black-fogra-29-1">
                        {product.name}
                      </td>
                      <td className="p-4 font-rubik text-[1.3rem] text-sonic-silver">
                        {product.category?.name || 'Uncategorized'}
                      </td>
                      <td className="p-4 font-catamaran font-medium text-coquelicot">
                        ₹{product.price}
                      </td>
                      <td className="p-4 font-rubik text-[1.3rem] text-sonic-silver">
                        {product.stock || 'N/A'}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-coquelicot text-white p-2 rounded-[5px] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-[#dc3545] text-white p-2 rounded-[5px] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-[10px] w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto border border-coquelicot-20">
              <h3 className="font-catamaran text-[2rem] font-bold text-rich-black-fogra-29-1 mb-6">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Category</label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      required
                    >
                      <option value="">Select Category</option>
                      {(Array.isArray(categories) ? categories : []).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="mt-2 w-full bg-white border border-coquelicot text-coquelicot px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-coquelicot hover:text-white transition-all duration-300"
                      onClick={() => setShowCategoryModal(true)}
                    >
                      + Add Category
                    </button>
                  </div>

                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Brand</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                    />
                  </div>

                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Warranty</label>
                    <input
                      type="text"
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      placeholder="e.g., 1 Year"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Material</label>
                    <input
                      type="text"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      placeholder="e.g., Steel, Plastic, Cotton"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 bg-coquelicot text-white px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                  >
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                      setFormData({
                        name: '',
                        description: '',
                        price: '',
                        categoryId: '',
                        imageUrl: '',
                        stock: '',
                        brand: '',
                        material: '',
                        warranty: ''
                      });
                    }}
                    className="flex-1 bg-white border border-coquelicot text-coquelicot px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-coquelicot hover:text-white transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100]">
            <div className="bg-white p-6 rounded-[10px] w-[90%] max-w-[400px] border border-coquelicot-20">
              <h3 className="font-catamaran text-[2rem] font-bold text-rich-black-fogra-29-1 mb-6">Add Category</h3>
              <form onSubmit={handleCategorySubmit}>
                <div className="mb-4">
                  <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Name</label>
                  <input
                    name="name"
                    value={categoryForm.name}
                    onChange={handleCategoryChange}
                    className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={categoryForm.description}
                    onChange={handleCategoryChange}
                    className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                    rows="3"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-coquelicot text-white px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-white border border-coquelicot text-coquelicot px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-coquelicot hover:text-white transition-all duration-300"
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminProducts;