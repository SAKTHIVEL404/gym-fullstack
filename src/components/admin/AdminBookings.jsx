import { useState, useEffect } from 'react';
import { bookingsAPI } from '../../services/api';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Container, Row, Col, Table, Spinner, Form, Button, Badge } from 'react-bootstrap';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      setBookings(response.data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingsAPI.updateStatus(bookingId, status);
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'warning';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      case 'PENDING': return 'secondary';
      default: return 'light';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED': return <CheckCircle size={16} />;
      case 'CANCELLED': return <XCircle size={16} />;
      case 'PENDING':
      default: return <AlertCircle size={16} />;
    }
  };

  const filteredBookings = statusFilter
    ? bookings.filter(b => b.status === statusFilter)
    : bookings;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center justify-content-between">
        <Col><h2 className="fw-bold">Bookings Management</h2></Col>
        <Col md="3">
          <Form.Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-4">
        {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => (
          <Col key={status} md={3} className="mb-3">
            <div className="p-3 border rounded shadow-sm text-center">
              <div className="mb-2">
                <Badge bg={getStatusVariant(status)} className="p-2">
                  {getStatusIcon(status)}
                </Badge>
              </div>
              <h4>{bookings.filter(b => b.status === status).length}</h4>
              <small className="text-muted text-capitalize">{status.toLowerCase()}</small>
            </div>
          </Col>
        ))}
      </Row>

      <Table responsive bordered hover>
        <thead className="table-light">
          <tr>
            <th>User</th>
            <th>Session</th>
            <th>Date & Time</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length === 0 ? (
            <tr><td colSpan="6" className="text-center">No bookings found</td></tr>
          ) : (
            filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td>
                  <strong>{booking.user?.name}</strong><br />
                  <small>{booking.user?.email}</small>
                </td>
                <td>
                  <strong>{booking.session?.title}</strong><br />
                  <small>{booking.session?.instructorName}</small>
                </td>
                <td>
                  <Calendar size={14} className="me-1 text-danger" />
                  {new Date(booking.session?.scheduledDate).toLocaleDateString()}<br />
                  <Clock size={14} className="me-1 text-danger" />
                  {new Date(booking.session?.scheduledDate).toLocaleTimeString()}
                </td>
                <td className="text-danger fw-bold">₹{booking.amount}</td>
                <td>
                  <Badge bg={getStatusVariant(booking.status)}>
                    {getStatusIcon(booking.status)} {booking.status}
                  </Badge>
                </td>
                <td>
                  {booking.status === 'PENDING' && (
                    <>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}>Confirm</Button>
                      <Button variant="danger" size="sm" onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}>Cancel</Button>
                    </>
                  )}
                  {booking.status === 'CONFIRMED' && (
                    <Button variant="success" size="sm" onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}>Complete</Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminBookings;
