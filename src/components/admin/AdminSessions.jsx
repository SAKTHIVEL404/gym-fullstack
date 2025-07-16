import { useState, useEffect } from 'react';
import { Modal, Button, Form, Container, Row, Col, Spinner, Card } from 'react-bootstrap';
import { Plus, Edit, Trash2, Calendar, Clock, Users } from 'lucide-react';
import { sessionsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructorName: '',
    scheduledDate: '',
    duration: '',
    maxParticipants: '',
    price: '',
    imageUrl: '',
    meetLink: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await sessionsAPI.getAll();
      setSessions(response.data.data || []);
    } catch {
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      instructorName: formData.instructorName.trim(),
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString().slice(0, 19) : null,
      duration: parseInt(formData.duration, 10),
      maxParticipants: parseInt(formData.maxParticipants, 10),
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl.trim() || null,
      meetLink: formData.meetLink.trim() || null
    };

    if (!payload.title || !payload.instructorName || !payload.scheduledDate || !payload.duration || !payload.maxParticipants || !payload.price) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingSession) {
        await sessionsAPI.update(editingSession.id, payload);
        toast.success('Session updated');
      } else {
        await sessionsAPI.create(payload);
        toast.success('Session created');
      }
      setShowModal(false);
      setEditingSession(null);
      resetForm();
      fetchSessions();
    } catch {
      toast.error('Failed to save');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructorName: '',
      scheduledDate: '',
      duration: '',
      maxParticipants: '',
      price: '',
      imageUrl: '',
      meetLink: ''
    });
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      ...session,
      scheduledDate: new Date(session.scheduledDate).toISOString().slice(0, 16)
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionsAPI.delete(id);
        toast.success('Session deleted');
        fetchSessions();
      } catch {
        toast.error('Delete failed');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Sessions</h2>
        <Button variant="warning" onClick={() => setShowModal(true)}>
          <Plus size={18} className="me-2" /> Add Session
        </Button>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="warning" />
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {sessions.map((session) => (
            <Col key={session.id}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={session.imageUrl || 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{session.title}</Card.Title>
                  <Card.Text>
                    <small>Instructor: {session.instructorName}</small>
                    <br />
                    {session.description?.slice(0, 60)}...
                    <br />
                    <Calendar size={14} className="me-2" /> {new Date(session.scheduledDate).toLocaleDateString()} <br />
                    <Clock size={14} className="me-2" /> {session.duration} min <br />
                    <Users size={14} className="me-2" /> {session.maxParticipants} people
                  </Card.Text>
                  <strong className="text-warning">₹{session.price}</strong>
                </Card.Body>
                <Card.Footer className="d-flex gap-2">
                  <Button variant="outline-warning" onClick={() => handleEdit(session)} className="w-50">
                    <Edit size={16} className="me-1" /> Edit
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(session.id)} className="w-50">
                    <Trash2 size={16} className="me-1" /> Delete
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingSession ? 'Edit Session' : 'Add Session'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Instructor Name</Form.Label>
              <Form.Control name="instructorName" value={formData.instructorName} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Scheduled Date</Form.Label>
              <Form.Control type="datetime-local" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} required />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (min)</Form.Label>
                  <Form.Control type="number" name="duration" value={formData.duration} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Max Participants</Form.Label>
                  <Form.Control type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Google Meet Link</Form.Label>
              <Form.Control type="url" name="meetLink" value={formData.meetLink} onChange={handleChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditingSession(null); resetForm(); }}>
              Cancel
            </Button>
            <Button variant="warning" type="submit">
              {editingSession ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default AdminSessions;
