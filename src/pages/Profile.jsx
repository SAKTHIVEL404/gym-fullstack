import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import { Calendar, Clock, Video, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Card,
  Button,
  Spinner,
  Form,
  Image,
} from 'react-bootstrap';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await bookingsAPI.getUserBookings();
      const apiResp = response.data;
      setBookings(apiResp.data || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  const bookingsArray = Array.isArray(bookings) ? bookings : [];

  return (
    <Container className="pt-5" style={{ minHeight: '100vh' }}>
      {/* Profile Header */}
      <Card className="mb-4 text-center">
        <Card.Body>
          <div className="mx-auto rounded-circle bg-danger text-white d-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px', fontSize: '3rem' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h2>{user?.name}</h2>
          <p className="text-muted">Member since {new Date(user?.createdAt).toLocaleDateString() || 'Recently'}</p>
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <Mail size={16} /> {user?.email}
            </div>
            <div className="d-flex align-items-center gap-2">
              <Phone size={16} /> {user?.phone || 'Not provided'}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
        fill
      >
        <Tab eventKey="bookings" title="My Bookings">
          {bookingsArray.length === 0 ? (
            <Card className="text-center p-4">
              <Video size={64} className="text-danger mx-auto mb-3" />
              <h4>No Bookings Yet</h4>
              <p className="text-muted">You haven't booked any sessions yet.</p>
              <Button href="/online-sessions" variant="danger">
                Browse Sessions
              </Button>
            </Card>
          ) : (
            <Row xs={1} md={1} className="g-4">
              {bookingsArray.map((booking) => (
                <Col key={booking.id}>
                  <Card>
                    <Row className="g-0 align-items-center">
                      <Col xs={3}>
                        <Image
                          src={booking.session?.imageUrl || 'https://via.placeholder.com/80'}
                          alt={booking.session?.title}
                          fluid
                          rounded
                        />
                      </Col>
                      <Col xs={6}>
                        <Card.Body>
                          <Card.Title>{booking.session?.title}</Card.Title>
                          <Card.Text className="text-muted">
                            Instructor: {booking.session?.instructorName}
                          </Card.Text>
                          <div className="d-flex gap-3">
                            <div className="d-flex align-items-center gap-1">
                              <Calendar size={14} />{' '}
                              {new Date(booking.session?.scheduledDate).toLocaleDateString()}
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <Clock size={14} /> {booking.session?.duration} min
                            </div>
                          </div>
                        </Card.Body>
                      </Col>
                      <Col xs={3} className="text-end pe-3">
                        <div
                          className={`badge bg-${
                            booking.status === 'CONFIRMED'
                              ? 'danger'
                              : booking.status === 'COMPLETED'
                              ? 'success'
                              : 'warning'
                          } mb-2`}
                        >
                          {booking.status}
                        </div>
                        {booking.status === 'CONFIRMED' && booking.meetLink && (
                          <Button
                            href={booking.meetLink}
                            target="_blank"
                            size="sm"
                            variant="outline-danger"
                          >
                            <Video size={14} className="me-1" /> Join Session
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Tab>

        <Tab eventKey="profile" title="Profile Settings">
          <Card className="p-4">
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" defaultValue={user?.name} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type="email" defaultValue={user?.email} disabled />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="tel" defaultValue={user?.phone} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" defaultValue={user?.dateOfBirth} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control as="textarea" rows={2} defaultValue={user?.address} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fitness Goals</Form.Label>
                <Form.Control as="textarea" rows={2} defaultValue={user?.fitnessGoals} />
              </Form.Group>
              <Button variant="danger" type="submit">
                Update Profile
              </Button>
            </Form>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Profile;