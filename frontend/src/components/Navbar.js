import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  let user = null;
  if (token) {
    user = jwt_decode(token);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Phoenix Fitness
        </Link>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/products" className="hover:underline">Products</Link>
          <Link to="/sessions" className="hover:underline">Sessions</Link>
          {user && <Link to="/bookings" className="hover:underline">My Bookings</Link>}
          {user && user.role === 'ADMIN' && <Link to="/admin" className="hover:underline">Admin</Link>}
          {user ? (
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;