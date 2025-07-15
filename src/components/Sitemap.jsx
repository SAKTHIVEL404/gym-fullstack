import { Link } from 'react-router-dom';
import Seo from './Seo';

const Sitemap = () => {
  return (
    <>
      <Seo
        title="Phoenix Fitness Studio - Sitemap"
        description="Explore all pages and categories of Phoenix Fitness Studio. Find our gym services, shop, blog posts, and more."
        keywords="gym, fitness, workout, sitemap, site map, navigation"
      />

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Phoenix Fitness Studio - Sitemap</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Main Pages</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="block text-gray-700 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="block text-gray-700 hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/online-sessions" className="block text-gray-700 hover:text-primary transition-colors">
                  Online Sessions
                </Link>
              </li>
              <li>
                <Link to="/profile" className="block text-gray-700 hover:text-primary transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/login" className="block text-gray-700 hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="block text-gray-700 hover:text-primary transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/admin" className="block text-gray-700 hover:text-primary transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Shop Categories</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/equipment" className="block text-gray-700 hover:text-primary transition-colors">
                  Gym Equipment
                </Link>
              </li>
              <li>
                <Link to="/shop/clothing" className="block text-gray-700 hover:text-primary transition-colors">
                  Fitness Apparel
                </Link>
              </li>
              <li>
                <Link to="/shop/accessories" className="block text-gray-700 hover:text-primary transition-colors">
                  Fitness Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Blog Posts</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/blog/fitness-tips" className="block text-gray-700 hover:text-primary transition-colors">
                  Fitness Tips
                </Link>
              </li>
              <li>
                <Link to="/blog/nutrition" className="block text-gray-700 hover:text-primary transition-colors">
                  Nutrition Guides
                </Link>
              </li>
              <li>
                <Link to="/blog/workouts" className="block text-gray-700 hover:text-primary transition-colors">
                  Workout Routines
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sitemap;
