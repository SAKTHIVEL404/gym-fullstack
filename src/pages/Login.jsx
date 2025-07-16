import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner
} from 'react-bootstrap';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData);
    if (result.success) {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="bg-light py-5 d-flex align-items-center" style={{ minHeight: '100vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <Card className="p-4 shadow">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Welcome Back</h2>
                  <p className="text-muted">Sign in to your Phoenix Fitness Studio account</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formEmail" className="mb-3">
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

                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>
                      <Lock size={16} className="me-2 text-danger" />
                      Password
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter your password"
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

                  <Button
                    type="submit"
                    variant="danger"
                    className="w-100 d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                          role="status"
                        />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <p>
                    Don't have an account?{' '}
                    <Link to="/register" className="text-danger fw-semibold">
                      Create Account
                    </Link>
                  </p>
                  <p>
                    <Link to="/forgot-password" className="text-muted small">
                      Forgot Password?
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

export default Login;
