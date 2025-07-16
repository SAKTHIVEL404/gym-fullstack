import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Dumbbell, Sparkles, Heart, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  useEffect(() => {
    document.title = 'Phoenix Fitness Studio - Premium Gym & Fitness Center';
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, []);

  const [pricing] = useState([
    {
      id: 1,
      title: 'Basic Membership',
      description: 'Access to gym equipment and locker rooms. Perfect for beginners.',
      price: '₹999/month',
      features: ['Gym Equipment Access', 'Locker Room', 'Basic Support']
    },
    {
      id: 2,
      title: 'Premium Membership',
      description: 'Includes group classes (Yoga, Zumba) and 24-hour gym access.',
      price: '₹1,999/month',
      features: ['All Basic Features', 'Group Classes', '24-Hour Access', 'Nutrition Guidance']
    },
    {
      id: 3,
      title: 'Elite Membership',
      description: 'All-access pass with personal training sessions and CrossFit.',
      price: '₹2,999/month',
      features: ['All Premium Features', 'Personal Training', 'CrossFit Classes', 'Priority Support']
    }
  ]);

  const [blogs] = useState([
    {
      id: 1,
      title: "Top 5 Weight Loss Tips from Erode's Best Gym",
      description: 'Discover effective strategies for weight loss at our gym in Erode Perundurai. Start your transformation today!',
      image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '2 July 2025'
    },
    {
      id: 2,
      title: 'How to Choose a Gym in Perundurai',
      description: 'Learn what to look for in a fitness center in Perundurai to meet your goals.',
      image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '2 July 2025'
    },
    {
      id: 3,
      title: 'Benefits of Yoga Classes in Erode Perundurai',
      description: 'Explore how our yoga classes can enhance your physical and mental health.',
      image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '2 July 2025'
    }
  ]);

  return (
    <div className="bg-light py-5">
      {/* Hero Section */}
      <Container className="text-center py-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="display-4 fw-bold mb-3">Welcome to Phoenix Fitness Studio</h1>
          <p className="lead mb-4">Your Journey to a Healthier You Begins Here</p>
          <Button as={Link} to="/membership" variant="danger">Join Now</Button>
        </motion.div>
        <img
          src="https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Modern gym equipment"
          className="img-fluid rounded shadow mt-4"
        />
      </Container>

      {/* Pricing Section */}
      <Container className="py-5">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h2 className="text-center mb-4">Membership Plans</h2>
        </motion.div>
        <Row>
          {pricing.map(plan => (
            <Col md={4} className="mb-4" key={plan.id}>
              <motion.div
                className="h-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{plan.title}</Card.Title>
                    <Card.Text>{plan.description}</Card.Text>
                    <h4 className="text-danger mb-3">{plan.price}</h4>
                    <ul>
                      {plan.features.map((feature, idx) => (
                        <li key={idx}>✓ {feature}</li>
                      ))}
                    </ul>
                  </Card.Body>
                  <Card.Footer>
                    <Button as={Link} to="/contact" variant="danger" className="w-100">Join Now</Button>
                  </Card.Footer>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Blog Section */}
      <Container className="py-5 bg-white">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <h2 className="text-center mb-4">Fitness Blog</h2>
        </motion.div>
        <Row>
          {blogs.map(blog => (
            <Col md={4} className="mb-4" key={blog.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="h-100 shadow-sm">
  <div style={{ height: "200px", overflow: "hidden" }}>
    <Card.Img
      variant="top"
      src={blog.image}
      alt={blog.title}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </div>
  <Card.Body>
    <Card.Title>{blog.title}</Card.Title>
    <Card.Text>{blog.description}</Card.Text>
    <Button as={Link} to={`/blog/${blog.id}`} variant="link" className="text-danger">
      Read More
    </Button>
  </Card.Body>
  <Card.Footer className="text-muted small">{blog.date}</Card.Footer>
</Card>

              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;