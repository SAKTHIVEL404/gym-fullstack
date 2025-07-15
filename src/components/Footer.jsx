import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Dumbbell, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-rich-black-fogra-29-1 text-white font-rubik text-[1.6rem] leading-[1.6]">
      <div className="py-[80px] px-4">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Footer Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <Dumbbell className="text-coquelicot" size={35} />
              <span className="font-catamaran text-[2.5rem] font-extrabold text-white">
                Phoenix Fitness Studio
              </span>
            </Link>
            <p className="text-sonic-silver text-[1.4rem] mb-6">
              Your go-to fitness center in Erode Perundurai for affordable gym memberships,
              fitness products, and expert online training sessions.
            </p>
            <div className="flex gap-4">
              <Clock className="text-coquelicot" size={34} />
              <ul className="text-[1.3rem]">
                <li className="mb-2">
                  <p className="font-catamaran font-medium text-white">Monday - Friday</p>
                  <p className="text-sonic-silver">7:00 AM - 10:00 PM</p>
                </li>
                <li>
                  <p className="font-catamaran font-medium text-white">Saturday - Sunday</p>
                  <p className="text-sonic-silver">7:00 AM - 2:00 PM</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <ul>
            <li>
              <p className="font-catamaran text-[2rem] font-bold text-white relative before:content-[''] before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-coquelicot before:rounded-full mb-4">
                Quick Links
              </p>
            </li>
            <li><Link to="/" className="text-sonic-silver text-[1.4rem] hover:text-coquelicot transition-colors duration-300">Home</Link></li>
            <li><Link to="/shop" className="text-sonic-silver text-[1.4rem] hover:text-coquelicot transition-colors duration-300">Shop</Link></li>
            <li><Link to="/online-sessions" className="text-sonic-silver text-[1.4rem] hover:text-coquelicot transition-colors duration-300">Online Sessions</Link></li>
            <li><Link to="/#about" className="text-sonic-silver text-[1.4rem] hover:text-coquelicot transition-colors duration-300">About Us</Link></li>
            <li><Link to="/#services" className="text-sonic-silver text-[1.4rem] hover:text-coquelicot transition-colors duration-300">Services</Link></li>
            <li><Link to="/#pricing" className="text-sonic-silver text-[1.4rem] hover:text-coquelicot transition-colors duration-300">Pricing</Link></li>
            <li><Link to="/#contact" className="text-sonic-silver text-[1.4rem] hover:text-coquelicot transition-colors duration-300">Contact</Link></li>
          </ul>

          {/* Contact Info */}
          <ul>
            <li>
              <p className="font-catamaran text-[2rem] font-bold text-white relative before:content-[''] before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-coquelicot before:rounded-full mb-4">
                Contact Info
              </p>
            </li>
            <li className="flex items-start gap-3 mb-4">
              <MapPin size={20} className="text-coquelicot" />
              <address className="text-sonic-silver text-[1.4rem] not-italic">
                123 Fitness Road, Perundurai, Erode, Tamil Nadu 638052
              </address>
            </li>
            <li className="flex items-start gap-3 mb-4">
              <Phone size={20} className="text-coquelicot" />
              <div>
                <a href="tel:+919876543210" className="text-sonic-silver text-[1.4rem] hover:text-coquelicot transition-colors duration-300 block">
                  +91 9876543210
                </a>
                <a href="tel:18001213637" className="text-sonic-silver text-[1.4rem] hover:text-coquelicot transition-colors duration-300 block">
                  1800-121-3637
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={20} className="text-coquelicot" />
              <a href="mailto:info@phoenixfitnessstudio.com" className="text-sonic-silver text-[1.4rem] hover:text-coquelicot transition-colors duration-300">
                info@phoenixfitnessstudio.com
              </a>
            </li>
          </ul>

          {/* Newsletter */}
          <ul>
            <li>
              <p className="font-catamaran text-[2rem] font-bold text-white relative before:content-[''] before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-3 before:bg-coquelicot before:rounded-full mb-4">
                Newsletter
              </p>
            </li>
            <li>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="flex-1 bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                />
                <button
                  type="submit"
                  className="bg-coquelicot text-white px-4 py-2 rounded-[8px] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                >
                  <Mail size={20} />
                </button>
              </form>
            </li>
            <li className="mt-4">
              <ul className="flex gap-3">
                <li>
                  <a href="#" className="text-sonic-silver hover:text-coquelicot transition-colors duration-300">
                    <Facebook size={20} />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sonic-silver hover:text-coquelicot transition-colors duration-300">
                    <Instagram size={20} />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sonic-silver hover:text-coquelicot transition-colors duration-300">
                    <Twitter size={20} />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sonic-silver hover:text-coquelicot transition-colors duration-300">
                    <Linkedin size={20} />
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-rich-black-fogra-29-2 py-4 border-t border-coquelicot-20">
        <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sonic-silver text-[1.3rem]">
            © 2025 Phoenix Fitness Studio. All Rights Reserved By{' '}
            <a href="#" className="text-coquelicot hover:underline">
              InOutTek Solutions
            </a>.
          </p>
          <ul className="flex gap-4">
            <li>
              <a href="#" className="text-sonic-silver text-[1.3rem] hover:text-coquelicot transition-colors duration-300 relative before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-coquelicot before:rounded-full">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-sonic-silver text-[1.3rem] hover:text-coquelicot transition-colors duration-300 relative before:content-[''] before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-coquelicot before:rounded-full">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;