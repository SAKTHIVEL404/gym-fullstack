import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner
} from 'react-bootstrap';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (result.success) {
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light py-5 d-flex align-items-center" style={{ minHeight: '100vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="p-4 shadow-sm">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Join Phoenix Fitness</h2>
                  <p className="text-muted">Create your account and start your fitness journey today</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  {/* Name */}
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>
                      <User size={16} className="me-2 text-danger" />
                      Full Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Email */}
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>
                      <Mail size={16} className="me-2 text-danger" />
                      Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Phone */}
                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>
                      <Phone size={16} className="me-2 text-danger" />
                      Phone Number
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  {/* Password */}
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>
                      <Lock size={16} className="me-2 text-danger" />
                      Password
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="position-absolute top-50 end-0 translate-middle-y pe-3"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </Form.Group>

                  {/* Confirm Password */}
                  <Form.Group className="mb-4" controlId="formConfirmPassword">
                    <Form.Label>
                      <Lock size={16} className="me-2 text-danger" />
                      Confirm Password
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <Button
                        variant="link"
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="position-absolute top-50 end-0 translate-middle-y pe-3"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </Form.Group>

                  {/* Submit */}
                  <Button
                    variant="danger"
                    type="submit"
                    className="w-100 d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-danger fw-semibold">
                      Sign In
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
