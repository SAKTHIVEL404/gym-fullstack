import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
} from 'react-bootstrap';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';

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
      const response = await productsAPI.getAll({ search: searchTerm, category: selectedCategory });
      setProducts(response.data.data || []);
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data || []);
    } catch {
      toast.error('Failed to fetch categories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        toast.success('Product updated');
      } else {
        await productsAPI.create(payload);
        toast.success('Product created');
      }
      setShowModal(false);
      setEditingProduct(null);
      resetForm();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', description: '', price: '', categoryId: '', imageUrl: '', stock: '', brand: '', material: '', warranty: ''
    });
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
        toast.success('Deleted');
        fetchProducts();
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      toast.error(err.response?.data?.error || 'Failed to create category');
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryForm({ ...categoryForm, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center">
        <Col><h2>Products Management</h2></Col>
        <Col className="text-end">
          <Button variant="danger" onClick={() => setShowModal(true)}><Plus size={18} /> Add Product</Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><Search size={18} /></InputGroup.Text>
            <Form.Control
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><Filter size={18} /></InputGroup.Text>
            <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td><img src={p.imageUrl || 'https://via.placeholder.com/50'} alt={p.name} width={50} /></td>
              <td>{p.name}</td>
              <td>{p.category?.name || 'Uncategorized'}</td>
              <td>₹{p.price}</td>
              <td>{p.stock || 'N/A'}</td>
              <td>
                <Button size="sm" variant="warning" onClick={() => handleEdit(p)}><Edit size={16} /></Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}><Trash2 size={16} /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Form.Select>
              <Button variant="link" size="sm" onClick={() => setShowCategoryModal(true)}>
                + Add Category
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" type="number" value={formData.price} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control name="stock" type="number" value={formData.stock} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control name="brand" value={formData.brand} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Material</Form.Label>
              <Form.Control name="material" value={formData.material} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Warranty</Form.Label>
              <Form.Control name="warranty" value={formData.warranty} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="danger">{editingProduct ? 'Update' : 'Create'}</Button>
              <Button variant="secondary" onClick={() => { setShowModal(false); setEditingProduct(null); resetForm(); }}>Cancel</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Category Modal */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Category</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCategorySubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control name="name" value={categoryForm.name} onChange={handleCategoryChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={2} name="description" value={categoryForm.description} onChange={handleCategoryChange} />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="danger">Save</Button>
              <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>Cancel</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminProducts;
