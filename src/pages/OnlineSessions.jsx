import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Video, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert
} from 'react-bootstrap';

const OnlineSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view sessions');
      return;
    }
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    try {
      const response = await sessionsAPI.getAll();
      const apiResp = response.data;
      if (apiResp.success) {
        setSessions(apiResp.data || []);
      } else {
        throw new Error(apiResp.message || 'Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const sessionsArray = Array.isArray(sessions) ? sessions : [];

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Container>
        {/* Header */}
        <div className="text-center mb-5">
          <p className="text-muted">Online Training</p>
          <h1 className="fw-bold">Virtual Fitness Sessions</h1>
          <p>
            Join our expert trainers for live online sessions from the comfort of your home.
            Get personalized attention and achieve your fitness goals with our virtual training programs.
          </p>
        </div>

        {/* Sessions */}
        {sessionsArray.length === 0 ? (
          <Alert variant="info" className="text-center">
            <Video size={32} className="mb-2 text-primary" />
            <h4>No Sessions Available</h4>
            <p>Check back later for upcoming online training sessions.</p>
          </Alert>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {sessionsArray.map((session) => (
              <Col key={session.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Img
                    variant="top"
                    src={
                      session.imageUrl ||
                      'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600'
                    }
                    alt={session.title}
                  />
                  <Card.Body>
                    <div className="d-flex align-items-center text-muted mb-2">
                      <Calendar size={16} className="me-1" />
                      {new Date(session.scheduledDate).toLocaleDateString()}
                    </div>
                    <Card.Title>{session.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted d-flex align-items-center">
                      <User size={16} className="me-1" />
                      Instructor: {session.instructorName}
                    </Card.Subtitle>
                    <Card.Text>{session.description}</Card.Text>

                    <div className="d-flex flex-wrap gap-2 small text-muted mb-3">
                      <div className="d-flex align-items-center">
                        <Clock size={14} className="me-1" /> {session.duration} min
                      </div>
                      <div className="d-flex align-items-center">
                        <Users size={14} className="me-1" /> {session.maxParticipants} participants
                      </div>
                      <div className="d-flex align-items-center">
                        <Video size={14} className="me-1" /> Live Session
                      </div>
                    </div>

                    <h5 className="text-primary">₹{session.price}</h5>

                    <div className="d-flex gap-2 mt-3">
                      <Button
                        as={Link}
                        to={user ? `/book-session/${session.id}` : '/login'}
                        variant="primary"
                        className="flex-fill"
                      >
                        {user ? 'Book Session' : 'Login to Book'}
                      </Button>
                      <Button variant="outline-secondary">Learn More</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Benefits Section */}
        <div className="mt-5 text-center">
          <h2 className="fw-bold">Why Choose Our Online Sessions?</h2>
          <Row className="mt-4 g-4">
            {[
              {
                icon: '🏠',
                title: 'Train from Home',
                text: 'No need to travel. Join from the comfort of your home with just an internet connection.',
              },
              {
                icon: '👨‍🏫',
                title: 'Expert Guidance',
                text: 'Get personalized attention from certified trainers who guide you through every workout.',
              },
              {
                icon: '⏰',
                title: 'Flexible Timing',
                text: 'Choose from multiple time slots that fit your schedule and lifestyle.',
              },
              {
                icon: '💰',
                title: 'Affordable Pricing',
                text: 'High-quality training at affordable prices. Pay per session or choose monthly packages.',
              },
            ].map(({ icon, title, text }, idx) => (
              <Col key={idx} xs={12} md={6} lg={3}>
                <Card className="h-100 shadow-sm text-center">
                  <Card.Body>
                    <div style={{ fontSize: '2.5rem' }}>{icon}</div>
                    <Card.Title className="mt-2">{title}</Card.Title>
                    <Card.Text>{text}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default OnlineSessions;
