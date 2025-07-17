  import { useState, useEffect, useCallback } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { User, Mail, Phone, Calendar, Shield, ShieldCheck, X } from 'lucide-react';
  import toast from 'react-hot-toast';
  import { useAuth } from '../../context/AuthContext';
  import { authAPI } from '../../services/api';
  import { Modal, Table, Button, Form, Row, Col, Spinner, Container } from 'react-bootstrap';

  const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { validateToken } = useAuth();
    const navigate = useNavigate();

    const fetchUsers = useCallback(async () => {
      setLoading(true);
      try {
        const isValid = await validateToken();
        if (!isValid) {
          toast.error('Session expired. Please log in again.');
          navigate('/login');
          return;
        }

        const response = await authAPI.getAllUsers();
        let userData = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
          ? response.data.data
          : [];

        const uniqueUsersMap = new Map();
        userData.forEach((user) => {
          const key = user.id || user.email;
          if (key && !uniqueUsersMap.has(key)) {
            uniqueUsersMap.set(key, user);
          }
        });
        setUsers(Array.from(uniqueUsersMap.values()));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }, [navigate, validateToken]);

    useEffect(() => {
      fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = !roleFilter || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    return (
      <Container className="py-5">
        <h2 className="mb-4 text-center">Manage Users</h2>

        <Row className="mb-4">
          <Col md={6} className="mb-2">
            <Form.Control
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={3} className="mb-2">
            <Form.Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </Form.Select>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} onClick={() => {
                  setSelectedUser(user);
                  setShowModal(true);
                }} style={{ cursor: 'pointer' }}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td><ShieldCheck /></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>User Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <>
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  };

  export default AdminUsers;
