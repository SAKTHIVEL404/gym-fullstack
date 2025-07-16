import { Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin, Clock, Dumbbell,
  Facebook, Instagram, Twitter, Linkedin
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-5">
      <div className="container text-center text-md-start">
        <div className="row text-center text-md-start">
          {/* Brand Info */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-primary d-flex align-items-center">
              <Dumbbell className="me-2" />
              Phoenix Fitness
            </h5>
            <p>
              Your go-to fitness center in Erode Perundurai for affordable gym memberships,
              fitness products, and expert online training sessions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-primary">Quick Links</h5>
            <p><Link to="/" className="text-white text-decoration-none">Home</Link></p>
            <p><Link to="/shop" className="text-white text-decoration-none">Shop</Link></p>
            <p><Link to="/online-sessions" className="text-white text-decoration-none">Online Sessions</Link></p>
            <p><Link to="/#about" className="text-white text-decoration-none">About Us</Link></p>
          </div>

          {/* Contact */}
          <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-primary">Contact</h5>
            <p className="d-flex align-items-center"><MapPin className="me-2" size={18} />123 Fitness Road, Erode</p>
            <p className="d-flex align-items-center"><Mail className="me-2" size={18} />info@phoenixfitness.com</p>
            <p className="d-flex align-items-center"><Phone className="me-2" size={18} />+91 98765 43210</p>
            <p className="d-flex align-items-center"><Clock className="me-2" size={18} />Mon–Sat: 6am - 10pm</p>
          </div>

          {/* Newsletter */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 fw-bold text-primary">Newsletter</h5>
            <form className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email address"
                aria-label="Email address"
              />
              <button className="btn btn-primary" type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <hr className="mb-4" />

        {/* Copyright */}
        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p className="mb-0">
              © 2025 <strong>Phoenix Fitness Studio</strong>. All Rights Reserved by{' '}
              <a href="#" className="text-primary text-decoration-none">InOutTek Solutions</a>.
            </p>
          </div>

          {/* Social Links */}
          <div className="col-md-5 col-lg-4">
            <div className="text-center text-md-end">
              <ul className="list-unstyled list-inline mb-0">
                <li className="list-inline-item mx-1">
                  <a href="#" className="text-white" aria-label="Facebook"><Facebook size={22} /></a>
                </li>
                <li className="list-inline-item mx-1">
                  <a href="#" className="text-white" aria-label="Instagram"><Instagram size={22} /></a>
                </li>
                <li className="list-inline-item mx-1">
                  <a href="#" className="text-white" aria-label="Twitter"><Twitter size={22} /></a>
                </li>
                <li className="list-inline-item mx-1">
                  <a href="#" className="text-white" aria-label="LinkedIn"><Linkedin size={22} /></a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
