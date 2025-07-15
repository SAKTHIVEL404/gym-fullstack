import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, ShoppingBag, Video, Dumbbell } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary"></div>
                <span className="text-gray-600">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold">Phoenix Fitness</div>
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-primary hover:text-primary-dark">Login</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark">Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleNavigation = (event, href) => {
    setIsMenuOpen(false);
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
      navigate(href);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop', icon: <ShoppingBag size={18} /> },
    { href: '/online-sessions', label: 'Online Sessions', icon: <Video size={18} /> },
    { href: '/#about', label: 'About Us' },
    { href: '/#services', label: 'Services' },
    { href: '/#pricing', label: 'Pricing' },
    { href: '/#contact', label: 'Contact' },
  ];

  const isActiveLink = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${isScrolled ? 'bg-rich-black-fogra-29-1 shadow-[0_4px_12px_rgba(0,0,0,0.2)]' : 'bg-white'}`}>
      <div className="max-w-[1140px] mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Dumbbell className="text-coquelicot" size={35} />
          <span className="font-catamaran text-[2.5rem] font-extrabold text-rich-black-fogra-29-1">
            Phoenix Fitness Studio
          </span>
        </Link>

        {/* Navbar */}
        <nav className={`fixed top-0 left-0 w-full h-full bg-rich-black-fogra-29-1 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:static lg:bg-transparent lg:transform-none lg:flex lg:items-center lg:h-auto`}>
          <button
            className="absolute top-4 right-4 text-white lg:hidden"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>

          <ul className="flex flex-col items-center gap-6 mt-16 lg:mt-0 lg:flex-row lg:gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`flex items-center gap-2 font-rubik text-[1.4rem] ${isScrolled ? 'text-white' : 'text-sonic-silver'} hover:text-coquelicot transition-colors duration-300 ${isActiveLink(link.href) ? 'text-coquelicot font-medium' : ''}`}
                  onClick={(e) => handleNavigation(e, link.href)}
                >
                  {link.icon && <span className="text-coquelicot">{link.icon}</span>}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="bg-white border border-coquelicot text-coquelicot px-3 py-1 rounded-[8px] font-rubik text-[1.4rem] flex items-center gap-2 hover:bg-coquelicot hover:text-white transition-all duration-300"
              >
                <User size={18} />
                {user.name}
              </Link>
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="bg-coquelicot text-white px-3 py-1 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                >
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-white border border-coquelicot text-coquelicot px-3 py-1 rounded-[8px] font-rubik text-[1.4rem] flex items-center gap-2 hover:bg-coquelicot hover:text-white transition-all duration-300"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="bg-white border border-coquelicot text-coquelicot px-3 py-1 rounded-[8px] font-rubik text-[1.4rem] hover:bg-coquelicot hover:text-white transition-all duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-coquelicot text-white px-3 py-1 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-sonic-silver hover:text-coquelicot"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile User Menu */}
      {isMenuOpen && user && (
        <div className="flex flex-col items-center gap-4 mt-4 lg:hidden">
          <Link
            to="/profile"
            className="bg-white border border-coquelicot text-coquelicot px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] flex items-center gap-2 hover:bg-coquelicot hover:text-white transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            <User size={18} />
            {user.name}
          </Link>
          {user.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="bg-coquelicot text-white px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Panel
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="bg-white border border-coquelicot text-coquelicot px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] flex items-center gap-2 hover:bg-coquelicot hover:text-white transition-all duration-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
      {isMenuOpen && !user && (
        <div className="flex flex-col items-center gap-4 mt-4 lg:hidden">
          <Link
            to="/login"
            className="bg-white border border-coquelicot text-coquelicot px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-coquelicot hover:text-white transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-coquelicot text-white px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Join Now
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;