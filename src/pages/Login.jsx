import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData);
    if (result.success) {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="pt-[100px] min-h-screen bg-gradient-to-br from-rich-black-fogra-29-1 to-coquelicot flex items-center justify-center font-rubik text-[1.6rem] text-sonic-silver">
      <div className="max-w-[500px] w-full px-4">
        <div className="bg-white p-10 rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="font-catamaran text-[3rem] font-extrabold text-rich-black-fogra-29-1 mb-2">
              Welcome Back
            </h1>
            <p className="text-[1.4rem] text-sonic-silver">
              Sign in to your Phoenix Fitness Studio account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="flex items-center gap-2 text-[1.3rem] text-sonic-silver mb-2">
                <Mail size={18} className="text-coquelicot" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 text-[1.4rem] focus:outline-none focus:border-coquelicot"
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-[1.3rem] text-sonic-silver mb-2">
                <Lock size={18} className="text-coquelicot" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 text-[1.4rem] focus:outline-none focus:border-coquelicot pr-12"
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sonic-silver hover:text-coquelicot"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-coquelicot text-white px-6 py-3 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center mt-6">
              <p className="text-[1.3rem] text-sonic-silver">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-coquelicot font-medium hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>

            <div className="text-center mt-4">
              <Link
                to="/forgot-password"
                className="text-[1.3rem] text-sonic-silver hover:text-coquelicot hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;