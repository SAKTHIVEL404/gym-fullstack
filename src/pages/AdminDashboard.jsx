import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Package, Users, Calendar, BarChart3, Settings, Menu } from 'lucide-react';
import AdminProducts from '../components/admin/AdminProducts';
import AdminSessions from '../components/admin/AdminSessions';
import AdminBookings from '../components/admin/AdminBookings';
import AdminUsers from '../components/admin/AdminUsers';

const AdminDashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply body class for admin theme (optional, can be removed if not needed)
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
    <div className="pt-[70px] flex min-h-screen bg-white font-rubik text-[1.6rem] text-sonic-silver">
      {/* Hamburger for mobile */}
      <button
        className="lg:hidden fixed top-[80px] left-4 z-[1001] text-coquelicot hover:text-rich-black-fogra-29-1 transition-colors duration-300"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div className={`fixed top-[70px] left-0 h-full w-[250px] bg-rich-black-fogra-29-1 text-white transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:transform-none lg:static lg:bg-gainsboro lg:border-r lg:border-coquelicot-20 z-[1000]`}>
        <h3 className="font-catamaran text-[2.5rem] font-extrabold text-white lg:text-rich-black-fogra-29-1 mb-8 px-6 pt-6">
          Admin Panel
        </h3>
        <nav>
          <ul className="flex flex-col gap-2 px-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.id ||
                              (currentPath === 'admin' && item.id === 'products');

              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] transition-colors duration-300 ${isActive ? 'bg-coquelicot text-white lg:bg-coquelicot-10 lg:text-coquelicot' : 'text-white lg:text-sonic-silver hover:bg-coquelicot-10 hover:text-coquelicot'}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 lg:pl-8 py-8 max-w-[1140px] mx-auto w-full" onClick={() => sidebarOpen && setSidebarOpen(false)}>
        <Routes>
          <Route path="/" element={<AdminProducts />} />
          <Route path="/products" element={<AdminProducts />} />
          <Route path="/sessions" element={<AdminSessions />} />
          <Route path="/bookings" element={<AdminBookings />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
};

const AdminSettings = () => {
  return (
    <section className="py-8">
      <div className="max-w-[1140px] mx-auto">
        <h2 className="font-catamaran text-[2.5rem] md:text-[4.5rem] font-extrabold text-rich-black-fogra-29-1 leading-[1.2] mb-6">
          Settings
        </h2>
        <div className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300">
          <div className="p-6 bg-gainsboro rounded-b-[10px]">
            <p className="font-rubik text-[1.4rem] text-sonic-silver">
              Settings panel coming soon...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;