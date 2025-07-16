// React Bootstrap version of SessionBooking component
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sessionsAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, CreditCard, Video, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { Container, Row, Col, Card, Form, Button, Spinner, Image } from 'react-bootstrap';

const SessionBooking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({ notes: '', paymentMethod: 'CARD' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => { fetchSession(); }, [id]);

  const fetchSession = async () => {
    try {
      const response = await sessionsAPI.getById(id);
      setSession(response.data);
    } catch (error) {
      toast.error('Failed to fetch session details');
      navigate('/online-sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingData.paymentMethod) return toast.error('Please select a payment method');
    setBookingLoading(true);
    try {
      const orderResponse = await paymentAPI.createOrder({ sessionId: session.id, amount: session.price, currency: 'INR' });
      const paymentResult = { success: true, paymentId: 'pay_' + Date.now(), orderId: orderResponse.data.orderId };
      if (paymentResult.success) {
        await sessionsAPI.book(session.id, { ...bookingData, paymentId: paymentResult.paymentId, orderId: paymentResult.orderId });
        toast.success('Session booked successfully!');
        navigate('/profile');
      } else toast.error('Payment failed. Please try again.');
    } catch (error) {
      toast.error('Failed to book session. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleImageNavigation = (dir) => {
    const images = session?.images || [session?.imageUrl];
    if (dir === 'next') setCurrentImageIndex((prev) => (prev + 1) % images.length);
    else setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="danger" /></div>;
  if (!session) return (
    <Container className="text-center pt-5">
      <h2>Session not found</h2>
      <Link to="/online-sessions" className="btn btn-danger mt-3">Back to Sessions</Link>
    </Container>
  );

  const images = session.images || [session.imageUrl];

  return (
    <Container className="pt-5">
      <div className="mb-4">
        <Link to="/online-sessions" className="text-danger"><ArrowLeft size={18} /> Back to Sessions</Link>
      </div>

      <h1 className="mb-4 text-center">Book Your Session</h1>

      <Row className="g-4">
        <Col lg={6}>
          <Card>
            <div className="position-relative">
              <Card.Img variant="top" src={images[currentImageIndex]} height="300" style={{ objectFit: 'cover' }} />
              {images.length > 1 && (
                <>
                  <Button variant="light" onClick={() => handleImageNavigation('prev')} className="position-absolute top-50 start-0 translate-middle-y">
                    <ChevronLeft size={20} />
                  </Button>
                  <Button variant="light" onClick={() => handleImageNavigation('next')} className="position-absolute top-50 end-0 translate-middle-y">
                    <ChevronRight size={20} />
                  </Button>
                </>
              )}
            </div>
            <Card.Body>
              <Card.Title>{session.title}</Card.Title>
              <Card.Text><User size={16} /> Instructor: {session.instructorName}</Card.Text>
              <Card.Text>{session.description}</Card.Text>
              <Card.Text><Calendar size={16} /> {new Date(session.scheduledDate).toLocaleDateString()}</Card.Text>
              <Card.Text><Clock size={16} /> {session.duration} minutes</Card.Text>
              <Card.Text><Video size={16} /> Online via Google Meet</Card.Text>
              <h5 className="text-danger">₹{session.price}</h5>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Title>Booking Details</Card.Title>
              <Form onSubmit={handleBooking}>
                <Form.Group className="mb-3">
                  <Form.Label>Participant Name</Form.Label>
                  <Form.Control type="text" value={user?.name || ''} disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" value={user?.email || ''} disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Special Notes</Form.Label>
                  <Form.Control as="textarea" rows={3} value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select value={bookingData.paymentMethod} onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}>
                    <option value="CARD">Credit/Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="NETBANKING">Net Banking</option>
                    <option value="WALLET">Digital Wallet</option>
                  </Form.Select>
                </Form.Group>
                <Card className="mb-3">
                  <Card.Body>
                    <Card.Title>Payment Summary</Card.Title>
                    <div className="d-flex justify-content-between">
                      <span>Session Price</span>
                      <span>₹{session.price}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Platform Fee</span>
                      <span>₹0</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold text-danger">
                      <span>Total</span>
                      <span>₹{session.price}</span>
                    </div>
                  </Card.Body>
                </Card>
                <Button type="submit" variant="danger" className="w-100" disabled={bookingLoading}>
                  {bookingLoading ? <Spinner size="sm" animation="border" /> : <><CreditCard size={20} /> Pay & Book</>}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SessionBooking;
