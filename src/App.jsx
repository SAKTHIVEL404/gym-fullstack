import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import OnlineSessions from './pages/OnlineSessions';
import SessionBooking from './pages/SessionBooking';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import Seo from './components/Seo';
import Sitemap from './components/Sitemap';

// SEO Constants
const siteTitle = 'Phoenix Fitness Studio';
const siteDescription = 'Premium gym and fitness center offering personal training, group classes, and premium workout gear.';
const siteUrl = 'https://your-domain.com';
const siteImage = `${siteUrl}/images/hero.jpg`;

const App = () => {
  return (
    <AuthProvider>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Seo
                title={siteTitle}
                description={siteDescription}
                image={siteImage}
                keywords="gym, fitness, workout, personal training, group classes, fitness center"
              />
              <Home />
            </>
          } />
          
          <Route path="/shop" element={
            <>
              <Seo
                title={`${siteTitle} - Shop`}
                description="Discover premium workout gear and fitness equipment at Phoenix Fitness Studio's online shop"
                image={`${siteUrl}/images/shop-hero.jpg`}
                keywords="workout gear, fitness equipment, gym apparel, fitness accessories"
              />
              <Shop />
            </>
          } />
          
          <Route path="/shop/product/:id" element={
            <>
              <Seo
                title={`${siteTitle} - Product Detail`}
                description="View product details and specifications"
                image={`${siteUrl}/images/product-default.jpg`}
                keywords="fitness product, workout equipment, gym gear"
              />
              <ProductDetail />
            </>
          } />
          
          <Route path="/online-sessions" element={
            <>
              <Seo
                title={`${siteTitle} - Online Sessions`}
                description="Join our virtual fitness classes and training sessions"
                image={`${siteUrl}/images/online-sessions.jpg`}
                keywords="online fitness classes, virtual workouts, home workout"
              />
              <OnlineSessions />
            </>
          } />
          
          <Route path="/profile" element={
            <PrivateRoute>
              <>
                <Seo
                  title={`${siteTitle} - Profile`}
                  description="Manage your fitness journey and personal information"
                  image={`${siteUrl}/images/profile-hero.jpg`}
                  keywords="fitness profile, workout history, personal training"
                />
                <Profile />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/book-session/:id" element={
            <PrivateRoute>
              <>
                <Seo
                  title={`${siteTitle} - Book Session`}
                  description="Book your personal training or group class session"
                  image={`${siteUrl}/images/session-hero.jpg`}
                  keywords="book workout, fitness session, personal training"
                />
                <SessionBooking />
              </>
            </PrivateRoute>
          } />
          
          <Route path="/login" element={
            <>
              <Seo
                title={`${siteTitle} - Login`}
                description="Login to your Phoenix Fitness Studio account"
                image={`${siteUrl}/images/login-hero.jpg`}
                keywords="gym login, fitness account, member login"
              />
              <Login />
            </>
          } />
          
          <Route path="/register" element={
            <>
              <Seo
                title={`${siteTitle} - Register`}
                description="Join Phoenix Fitness Studio and start your fitness journey"
                image={`${siteUrl}/images/register-hero.jpg`}
                keywords="gym registration, fitness membership, join gym"
              />
              <Register />
            </>
          } />
          
          <Route path="/sitemap" element={
            <>
              <Seo
                title={`${siteTitle} - Sitemap`}
                description="Explore all pages and categories of Phoenix Fitness Studio"
                image={`${siteUrl}/images/sitemap-hero.jpg`}
                keywords="gym sitemap, site map, navigation"
              />
              <Sitemap />
            </>
          } />
          
          <Route path="/admin/*" element={
            <PrivateRoute requiredRole="ADMIN">
              <>
                <Seo
                  title={`${siteTitle} - Admin Dashboard`}
                  description="Manage Phoenix Fitness Studio operations and content"
                  image={`${siteUrl}/images/admin-hero.jpg`}
                  keywords="gym admin, fitness management, dashboard"
                />
                <AdminDashboard />
              </>
            </PrivateRoute>
          } />
        </Routes>
        <Footer />
        <BackToTop />
      </div>
    </AuthProvider>
  );
};

export default App;