import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner, Offcanvas, Badge } from 'react-bootstrap';
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
    }, 500);
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
      if (Array.isArray(data)) setProducts(data);
      else if (data && Array.isArray(data.data)) setProducts(data.data);
      else {
        setProducts([]);
        toast.error('Invalid product data received');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      const data = response.data;
      if (Array.isArray(data)) setCategories(data);
      else if (data && Array.isArray(data.items)) setCategories(data.items);
      else setCategories([]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing)
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success('Item removed');
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const totalItems = cart.reduce((t, i) => t + (i.quantity || 1), 0);
  const totalPrice = cart.reduce((t, i) => t + i.price * (i.quantity || 1), 0);

  return (
    <Container className="py-5 mt-5">
      <Button
        variant="danger"
        className="position-fixed top-0 end-0 m-4"
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingBag /> {totalItems > 0 && <Badge bg="light" text="dark">{totalItems}</Badge>}
      </Button>

      <Offcanvas show={isCartOpen} onHide={() => setIsCartOpen(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Your Cart ({totalItems})</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <Card key={item.id} className="mb-3">
                <Card.Body>
                  <Row>
                    <Col xs={4}>
                      <Card.Img src={item.imageUrl || 'https://via.placeholder.com/100'} />
                    </Col>
                    <Col>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>₹{item.price * item.quantity}</Card.Text>
                      <InputGroup className="mb-2">
                        <Button variant="outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16} /></Button>
                        <Form.Control readOnly value={item.quantity} />
                        <Button variant="outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></Button>
                      </InputGroup>
                      <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={16} /> Remove
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
          {cart.length > 0 && (
            <div className="mt-4">
              <h5>Total: ₹{totalPrice.toFixed(2)}</h5>
              <Button variant="success" onClick={() => navigate('/checkout')}>Checkout</Button>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <h2 className="text-center mb-4">Shop Products</h2>

      <Row className="mb-4">
        <Col md>
          <InputGroup>
            <InputGroup.Text><Search size={16} /></InputGroup.Text>
            <Form.Control
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md>
          <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Form.Select>
        </Col>
        <Col md>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="rating">Sort by Rating</option>
          </Form.Select>
        </Col>
        <Col md>
          <InputGroup>
            <Form.Control
              type="number"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            />
            <Form.Control
              type="number"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            />
          </InputGroup>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <Row>
          {products.length ? products.map((product) => (
            <Col key={product.id} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={product.imageUrl || 'https://via.placeholder.com/300'} />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    ₹{product.price} {product.originalPrice && <del>₹{product.originalPrice}</del>}
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < (product.rating || 4) ? '#FF5733' : 'transparent'}
                          stroke="#FF5733"
                        />
                      ))}
                    </div>
                  </Card.Text>
                  <Button variant="danger" onClick={() => handleAddToCart(product)}>Add to Cart</Button>{' '}
                  <Link to={`/product/${product.id}`} className="btn btn-outline-secondary">View</Link>
                </Card.Body>
              </Card>
            </Col>
          )) : (
            <Col><p>No products found.</p></Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Shop;
