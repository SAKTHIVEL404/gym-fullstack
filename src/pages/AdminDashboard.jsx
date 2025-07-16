import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav, Button, Offcanvas } from 'react-bootstrap';
import { Package, Users, Calendar, BarChart3, Settings, Menu } from 'lucide-react';

import AdminProducts from '../components/admin/AdminProducts';
import AdminSessions from '../components/admin/AdminSessions';
import AdminBookings from '../components/admin/AdminBookings';
import AdminUsers from '../components/admin/AdminUsers';

const AdminSettings = () => (
  <section className="py-4">
    <Container>
      <h2 className="mb-4 fw-bold display-5 text-dark">Settings</h2>
      <div className="bg-light border rounded shadow-sm p-4">
        <p className="text-muted">Settings panel coming soon...</p>
      </div>
    </Container>
  </section>
);

const AdminDashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add('admin-blue');
    return () => document.body.classList.remove('admin-blue');
  }, []);

  const sidebarItems = [
    { id: 'products', label: 'Products', icon: Package, path: '/admin/products' },
    { id: 'sessions', label: 'Sessions', icon: Calendar, path: '/admin/sessions' },
    { id: 'bookings', label: 'Bookings', icon: BarChart3, path: '/admin/bookings' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', backgroundColor: '#fff' }}>
      {/* Hamburger (for mobile) */}
      <Button
        variant="link"
        onClick={() => setSidebarOpen(true)}
        className="position-fixed top-0 mt-3 ms-3 d-lg-none z-3 text-danger"
      >
        <Menu size={24} />
      </Button>

      {/* Sidebar for large screens */}
      <div
        className="d-none d-lg-block position-fixed top-0 start-0 h-100 bg-dark text-white pt-5"
        style={{ width: '250px', paddingTop: '80px' }}
      >
        <div className="px-4 mb-4">
          <h4 className="fw-bold text-white">Admin Panel</h4>
        </div>
        <Nav className="flex-column px-3">
          {sidebarItems.map(({ id, label, icon: Icon, path }) => {
            const isActive = currentPath === id || (currentPath === 'admin' && id === 'products');
            return (
              <Nav.Link
                as={Link}
                to={path}
                key={id}
                className={`d-flex align-items-center gap-2 mb-2 rounded px-3 py-2 ${isActive ? 'bg-danger text-white' : 'text-light'}`}
              >
                <Icon size={18} />
                {label}
              </Nav.Link>
            );
          })}
        </Nav>
      </div>

      {/* Sidebar for small screens */}
      <Offcanvas show={sidebarOpen} onHide={() => setSidebarOpen(false)} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {sidebarItems.map(({ id, label, icon: Icon, path }) => {
              const isActive = currentPath === id || (currentPath === 'admin' && id === 'products');
              return (
                <Nav.Link
                  as={Link}
                  to={path}
                  key={id}
                  onClick={() => setSidebarOpen(false)}
                  className={`d-flex align-items-center gap-2 mb-2 rounded px-3 py-2 ${isActive ? 'bg-danger text-white' : 'text-dark'}`}
                >
                  <Icon size={18} />
                  {label}
                </Nav.Link>
              );
            })}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <div className="ms-lg-auto" style={{ marginLeft: '250px', maxWidth: 'calc(100% - 250px)' }}>
        <Container fluid className="pt-4 px-3">
          <Routes>
            <Route path="/" element={<AdminProducts />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/sessions" element={<AdminSessions />} />
            <Route path="/bookings" element={<AdminBookings />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
