import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Navbar,
  Nav,
  Container,
  Button,
  NavDropdown,
  Spinner
} from 'react-bootstrap';
import {
  Menu, X, User, LogOut, ShoppingBag, Video, Dumbbell
} from 'lucide-react';

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setExpanded(false);
    navigate('/');
  };

  const handleNavigation = (event, href) => {
    setExpanded(false);
    if (href.includes('#')) {
      event.preventDefault();
      const [path, hash] = href.split('#');
      const targetHash = hash ? `#${hash}` : '';
      if (path && path !== location.pathname) {
        navigate(path || '/');
        setTimeout(() => {
          const el = document.querySelector(targetHash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.querySelector(targetHash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      if (location.pathname !== href) navigate(href);
    }
  };

  const isExternal = (url) => /^http(s)?:\/\//.test(url);

  const navLinks = [
    { href: 'http://localhost:8081/', label: 'Home' },
    { href: '/shop', label: 'Shop', icon: <ShoppingBag size={18} /> },
    { href: '/online-sessions', label: 'Online Sessions', icon: <Video size={18} /> },
    { href: 'http://localhost:8081/#about', label: 'About Us' },
    { href: 'http://localhost:8081/#services', label: 'Services' },
    { href: 'http://localhost:8081/#pricing', label: 'Pricing' },
    { href: 'http://localhost:8081/#contact', label: 'Contact' }
  ];

  const isActiveLink = (href) => {
    const [path] = href.split('#');
    return location.pathname === path;
  };

  if (loading) {
    return (
      <Navbar bg="light" className="shadow-sm sticky-top">
        <Container>
          <Spinner animation="border" variant="primary" />
          <span className="text-muted ms-2">Loading...</span>
        </Container>
      </Navbar>
    );
  }

  return (
    <Navbar
      expand="lg"
      expanded={expanded}
      bg={isScrolled ? 'dark' : 'light'}
      variant={isScrolled ? 'dark' : 'light'}
      fixed="top"
      className="shadow-sm transition-all"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <Dumbbell className="text-primary me-2" size={30} />
          <span className="fw-bold fs-4">Phoenix Fitness</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? <X size={24} /> : <Menu size={24} />}
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {navLinks.map(({ href, label, icon }) => {
              const external = isExternal(href);
              return (
                <Nav.Link
                  key={href}
                  {...(external
                    ? {
                        href,
                        // target: '_blank',
                        rel: 'noopener noreferrer'
                      }
                    : {
                        as: Link,
                        to: href,
                        onClick: (e) => handleNavigation(e, href),
                        active: isActiveLink(href)
                      })}
                >
                  {icon && <span className="me-1">{icon}</span>}
                  {label}
                </Nav.Link>
              );
            })}

            {/* Mobile Auth Buttons */}
            <div className="d-lg-none mt-3">
              {user ? (
                <>
                  <Nav.Link as={Link} to="/profile" onClick={() => setExpanded(false)}>
                    <User size={18} className="me-1" /> {user.name}
                  </Nav.Link>
                  {user.role === 'ADMIN' && (
                    <Nav.Link as={Link} to="/admin" onClick={() => setExpanded(false)}>
                      Admin Panel
                    </Nav.Link>
                  )}
                  <Button
                    variant="outline-danger"
                    onClick={handleLogout}
                    className="mt-2 w-100"
                  >
                    <LogOut size={18} className="me-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-primary"
                    className="w-100 mb-2"
                    onClick={() => setExpanded(false)}
                  >
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="primary"
                    className="w-100"
                    onClick={() => setExpanded(false)}
                  >
                    Join Now
                  </Button>
                </>
              )}
            </div>
          </Nav>

          {/* Desktop Auth */}
          {user ? (
            <Nav className="d-none d-lg-flex ms-3 align-items-center">
              <NavDropdown
                title={
                  <span className="d-flex align-items-center">
                    <User size={18} className="me-1" /> {user.name}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                {user.role === 'ADMIN' && (
                  <NavDropdown.Item as={Link} to="/admin">Admin Panel</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <LogOut size={18} className="me-1" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav className="d-none d-lg-flex ms-3">
              <Button as={Link} to="/login" variant="outline-primary" className="me-2">
                Login
              </Button>
              <Button as={Link} to="/register" variant="primary">
                Join Now
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
