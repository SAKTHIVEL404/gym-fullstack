
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Shield, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user, isAuthenticated, validateToken, refreshToken, logout } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Validate token before making request
      const isValid = await validateToken();
      if (!isValid) {
        toast.error('Session expired. Please log in again.');
        navigate('/login');
        return;
      }

      const response = await authAPI.get('/users');
      
      // Handle different response formats
      let userData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
        ? response.data.data
        : [];

      // Remove duplicates
      const uniqueUsersMap = new Map();
      userData.forEach((user) => {
        const key = user.id || user.email;
        if (key && !uniqueUsersMap.has(key)) {
          uniqueUsersMap.set(key, user);
        }
      });
      userData = Array.from(uniqueUsersMap.values());

      setUsers(userData);
      if (userData.length === 0) {
        toast.info('No users found');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter, fetchUsers]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-coquelicot"></div>
      </div>
    );
  }

  return (
    <section className="pt-[100px] min-h-screen bg-white font-rubik text-[1.4rem] text-sonic-silver">
      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] p-8 w-[90%] max-w-[600px] relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-coquelicot hover:text-rich-black-fogra-29-1"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-6">
              <h2 className="font-catamaran text-[2rem] text-rich-black-fogra-29-1 mb-2">
                User Details
              </h2>
              <p className="text-coquelicot">{selectedUser.name}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <User className="text-coquelicot" size={24} />
                <div>
                  <span className="font-semibold">Name:</span>
                  <p>{selectedUser.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Mail className="text-coquelicot" size={24} />
                <div>
                  <span className="font-semibold">Email:</span>
                  <p>{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Phone className="text-coquelicot" size={24} />
                <div>
                  <span className="font-semibold">Phone:</span>
                  <p>{selectedUser.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Shield className="text-coquelicot" size={24} />
                <div>
                  <span className="font-semibold">Role:</span>
                  <p className={`inline-block px-3 py-1 rounded-full text-[1.2rem] ${
                    selectedUser.role === 'ADMIN' ? 'bg-coquelicot text-white' : 'bg-coquelicot-50 text-coquelicot'
                  }`}>
                    {selectedUser.role}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Calendar className="text-coquelicot" size={24} />
                <div>
                  <span className="font-semibold">Joined:</span>
                  <p>{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1140px] mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-coquelicot font-catamaran text-[1.6rem] font-bold">Admin Dashboard</p>
          <h1 className="font-catamaran text-[2.5rem] md:text-[4rem] font-extrabold text-rich-black-fogra-29-1 mb-3">
            Manage Users
          </h1>
          <p className="text-[1.4rem] text-sonic-silver max-w-[700px] mx-auto">
            View and manage all registered users in your gym
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] p-6 mb-8">
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="flex-1 max-w-[300px]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 text-[1.4rem] focus:outline-none focus:border-coquelicot"
                />
                <User className="absolute right-3 top-1/2 -translate-y-1/2 text-coquelicot" />
              </div>
            </div>
            <div className="flex-1 max-w-[200px]">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 text-[1.4rem] focus:outline-none focus:border-coquelicot"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <table className="w-full">
            <thead>
              <tr className="bg-coquelicot text-white">
                <th className="px-6 py-4 text-left">Name</th>
                <th className="px-6 py-4 text-left">Email</th>
                <th className="px-6 py-4 text-left">Phone</th>
                <th className="px-6 py-4 text-left">Role</th>
                <th className="px-6 py-4 text-left">Joined Date</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-coquelicot-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <User className="text-coquelicot" />
                    {user.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="text-coquelicot" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Phone className="text-coquelicot" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[1.2rem] ${
                      user.role === 'ADMIN' ? 'bg-coquelicot text-white' : 'bg-coquelicot-50 text-coquelicot'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-coquelicot" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <ShieldCheck className="text-coquelicot hover:text-rich-black-fogra-29-1" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminUsers;
