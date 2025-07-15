
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });

    if (result.success) {
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="pt-[100px] min-h-screen bg-gradient-to-br from-rich-black-fogra-29-1 to-coquelicot flex items-center justify-center px-4">
      <div className="max-w-[500px] w-full">
        <div className="bg-white p-10 rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="font-catamaran text-[3rem] font-extrabold text-rich-black-fogra-29-1 mb-2">
              Join Phoenix Fitness
            </h1>
            <p className="font-rubik text-[1.4rem] text-sonic-silver">
              Create your account and start your fitness journey today
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="flex items-center gap-2 font-rubik text-[1.4rem] text-rich-black-fogra-29-1 mb-2">
                <User size={18} className="text-coquelicot" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] focus:outline-none focus:border-coquelicot"
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 font-rubik text-[1.4rem] text-rich-black-fogra-29-1 mb-2">
                <Mail size={18} className="text-coquelicot" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] focus:outline-none focus:border-coquelicot"
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 font-rubik text-[1.4rem] text-rich-black-fogra-29-1 mb-2">
                <Phone size={18} className="text-coquelicot" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] focus:outline-none focus:border-coquelicot"
                required
                placeholder="Enter your phone number"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 font-rubik text-[1.4rem] text-rich-black-fogra-29-1 mb-2">
                <Lock size={18} className="text-coquelicot" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] focus:outline-none focus:border-coquelicot pr-12"
                  required
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sonic-silver hover:text-coquelicot bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 font-rubik text-[1.4rem] text-rich-black-fogra-29-1 mb-2">
                <Lock size={18} className="text-coquelicot" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] focus:outline-none focus:border-coquelicot pr-12"
                  required
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sonic-silver hover:text-coquelicot bg-transparent border-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-coquelicot text-white px-6 py-3 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="text-center mt-5">
              <p className="font-rubik text-[1.4rem] text-sonic-silver">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-coquelicot font-medium hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
