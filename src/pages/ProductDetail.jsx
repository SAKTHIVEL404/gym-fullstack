// Due to the large size and detail of the component, here's the rewritten version of your
// ProductDetail component using React-Bootstrap

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Card,
  Spinner,
  Badge,
  Form,
  ListGroup,
  Alert
} from 'react-bootstrap';
import { ArrowLeft, ShoppingBag, Heart, Share2, ZoomIn, Star } from 'lucide-react';

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
      try {
        const response = await productsAPI.getById(id);
        const data = response.data.data;

        let productImages = [];
        if (Array.isArray(data.images)) {
          productImages = data.images;
        } else if (typeof data.images === 'string') {
          try {
            const parsed = JSON.parse(data.images);
            if (Array.isArray(parsed)) productImages = parsed;
          } catch (e) {
            console.warn('Failed to parse images');
          }
        }

        if (data.imageUrl && !productImages.includes(data.imageUrl)) {
          productImages.unshift(data.imageUrl);
        }

        setProduct(data);
        setMainImage(productImages[0]);
        setThumbnails(productImages);
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product?.sizes?.length && !selectedSize) return toast.error('Select size');
    if (product?.colors?.length && !selectedColor) return toast.error('Select color');
    toast.success(`${product?.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (product?.sizes?.length && !selectedSize) return toast.error('Select size');
    if (product?.colors?.length && !selectedColor) return toast.error('Select color');
    toast.success('Redirecting to checkout');
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5 text-center">
        <h2>{error || 'Product not found'}</h2>
        <Link to="/shop">
          <Button variant="danger">Back to Shop</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Link to="/shop" className="d-flex align-items-center mb-4 text-decoration-none">
        <ArrowLeft size={18} className="me-2" /> Back to Shop
      </Link>
      <Row>
        <Col md={6} className="mb-4">
          <Image src={mainImage} fluid rounded className="mb-3" />
          <div className="d-flex gap-2 overflow-auto">
            {thumbnails.map((img, i) => (
              <Image
                key={i}
                src={img}
                thumbnail
                style={{ width: 80, height: 80, cursor: 'pointer' }}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </Col>

        <Col md={6}>
          <Badge bg="warning" className="mb-2 text-dark">
            {product.category?.name || 'Product'}
          </Badge>

          <h2>{product.name}</h2>

          <div className="d-flex align-items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill={i < (product.rating || 4) ? '#FFC107' : 'none'} stroke="#FFC107" />
            ))}
            <span className="ms-2">({product.reviewCount || 0} reviews)</span>
          </div>

          <h4 className="text-danger">₹{product.price}</h4>
          {product.originalPrice && (
            <p className="text-muted">
              <del>₹{product.originalPrice}</del>
              {' '}({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
            </p>
          )}

          <p>{product.description}</p>

          {product.sizes?.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <div className="d-flex gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'dark' : 'outline-secondary'}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </Form.Group>
          )}

          {product.colors?.length > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>Color</Form.Label>
              <div className="d-flex gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? 'dark' : 'outline-secondary'}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Button variant="light" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
              <Form.Control style={{ width: '70px', textAlign: 'center' }} value={quantity} readOnly />
              <Button variant="light" onClick={() => setQuantity(quantity + 1)}>+</Button>
            </div>
          </Form.Group>

          <div className="d-flex gap-3">
            <Button variant="outline-danger" onClick={handleAddToCart}>
              <ShoppingBag size={18} className="me-2" /> Add to Cart
            </Button>
            <Button variant="danger" onClick={handleBuyNow}>Buy Now</Button>
          </div>
        </Col>
      </Row>

      {relatedProducts.length > 0 && (
        <>
          <h3 className="mt-5 mb-3">Related Products</h3>
          <Row>
            {relatedProducts.map((rp) => (
              <Col md={3} key={rp.id} className="mb-4">
                <Card>
                  <Card.Img
                    variant="top"
                    src={rp.imageUrl || 'https://via.placeholder.com/150'}
                    style={{ height: 150, objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>
                      <Link to={`/product/${rp.id}`} className="text-decoration-none">
                        {rp.name}
                      </Link>
                    </Card.Title>
                    <div className="d-flex align-items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < (rp.rating || 4) ? '#FFC107' : 'none'}
                          stroke="#FFC107"
                        />
                      ))}
                    </div>
                    <strong className="text-danger">₹{rp.price}</strong>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default ProductDetail;