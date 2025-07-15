import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { User, Clock, Users, Star, Phone, Mail, MapPin, Dumbbell, Sparkles, Heart, Flame, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Home = () => {
  const location = useLocation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // SEO Optimization
  useEffect(() => {
    document.title = 'Phoenix Fitness Studio - Premium Gym & Fitness Center';
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, []);

  const [services] = useState([
    {
      id: 1,
      title: 'Personal Training',
      description: 'Get one-on-one coaching with our expert trainers for personalized fitness plans in Erode Perundurai.',
      image: 'https://images.pexels.com/photos/703012/pexels-photo-703012.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: <Dumbbell size={24} />,
      availability: 80
    },
    {
      id: 2,
      title: 'Yoga Classes',
      description: 'Join our best yoga classes in Perundurai to improve flexibility, strength, and mental wellness.',
      image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: <Sparkles size={24} />,
      availability: 85
    },
    {
      id: 3,
      title: 'Zumba Classes',
      description: 'Dance your way to fitness with our energetic Zumba classes in Perundurai.',
      image: 'https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: <Heart size={24} />,
      availability: 75
    },
    {
      id: 4,
      title: 'CrossFit',
      description: 'Experience high-intensity CrossFit workouts in Erode Perundurai for strength and endurance.',
      image: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: <Flame size={24} />,
      availability: 70
    }
  ]);

  const [pricing] = useState([
    {
      id: 1,
      title: 'Basic Membership',
      description: 'Access to gym equipment and locker rooms. Perfect for beginners.',
      price: '₹999/month',
      features: ['Gym Equipment Access', 'Locker Room', 'Basic Support']
    },
    {
      id: 2,
      title: 'Premium Membership',
      description: 'Includes group classes (Yoga, Zumba) and 24-hour gym access.',
      price: '₹1,999/month',
      features: ['All Basic Features', 'Group Classes', '24-Hour Access', 'Nutrition Guidance']
    },
    {
      id: 3,
      title: 'Elite Membership',
      description: 'All-access pass with personal training sessions and CrossFit.',
      price: '₹2,999/month',
      features: ['All Premium Features', 'Personal Training', 'CrossFit Classes', 'Priority Support']
    }
  ]);

  const [blogs] = useState([
    {
      id: 1,
      title: 'Top 5 Weight Loss Tips from Erode\'s Best Gym',
      description: 'Discover effective strategies for weight loss at our gym in Erode Perundurai. Start your transformation today!',
      image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '2 July 2025'
    },
    {
      id: 2,
      title: 'How to Choose a Gym in Perundurai',
      description: 'Learn what to look for in a fitness center in Perundurai to meet your goals.',
      image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '2 July 2025'
    },
    {
      id: 3,
      title: 'Benefits of Yoga Classes in Erode Perundurai',
      description: 'Explore how our yoga classes can enhance your physical and mental health.',
      image: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600',
      date: '2 July 2025'
    }
  ]);

  useEffect(() => {
    const handleClick = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-[80px] bg-white" id="home">
        <div className="max-w-[1140px] mx-auto px-4 grid lg:grid-cols-2 gap-8">
          <div className="animate-slide-in-left">
            <p className="font-catamaran text-[1.8rem] font-bold text-coquelicot mb-4">
              <span className="text-rich-black-fogra-29-1">Best Gym</span> in Erode Perundurai
            </p>
            <h1 className="font-catamaran text-[3rem] md:text-[4.5rem] font-extrabold text-rich-black-fogra-29-1 leading-[1.2] mb-4">
              Rest is rare, winners dare you're the storm in the gym air!
            </h1>
            <p className="text-[1.4rem] mb-6">
              Join the Best Gym in Erode – Perundurai! Achieve your fitness goals with affordable plans,
              expert personal training, and powerful programs for weight loss, weight gain, and CrossFit.
              Start your transformation today at Phoenix Fitness Studio!
            </p>
            <Link
              to="/register"
              className="bg-coquelicot text-white px-6 py-3 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300 inline-block"
            >
              Join Now
            </Link>
          </div>
          <div className="animate-slide-in-right">
            <img
              src="https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Modern gym equipment in Erode Perundurai fitness center"
              className="w-full rounded-[10px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-[80px] bg-gainsboro" id="about">
        <div className="max-w-[1140px] mx-auto px-4 grid lg:grid-cols-2 gap-8">
          <div className="animate-slide-in-left">
            <img
              src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Erode Perundurai gym facilities"
              className="w-full rounded-[10px] object-cover"
            />
          </div>
          <div className="animate-slide-in-right">
            <p className="font-catamaran text-[1.8rem] font-bold text-coquelicot mb-4">About Us</p>
            <h2 className="font-catamaran text-[2.5rem] md:text-[4.5rem] font-extrabold text-rich-black-fogra-29-1 leading-[1.2] mb-4">
              Erode Perundurai's Premier Fitness Center
            </h2>
            <p className="text-[1.4rem] mb-4">
              Achieve Your Fitness Goals at Phoenix Fitness Studio – Erode Perundurai's Trusted Gym!
              We're here to help you transform with state-of-the-art equipment, certified trainers,
              and a friendly, motivating environment.
            </p>
            <p className="text-[1.4rem] mb-6">
              Weight Loss & Weight Gain Programs, Strength Training & CrossFit, Personalized Coaching
              & Affordable Memberships. Whether you're just starting out or pushing to the next level,
              Phoenix Fitness Studio is your destination for results.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=150"
                  alt="Personal trainer in Erode Perundurai"
                  className="w-[60px] h-[60px] rounded-full object-cover"
                />
                <div>
                  <h3 className="font-catamaran text-[1.8rem] font-bold text-rich-black-fogra-29-1">KAMALRAJA</h3>
                  <p className="text-[1.3rem] text-sonic-silver">Head Trainer</p>
                </div>
              </div>
              <a
                href="#services"
                className="bg-coquelicot text-white px-6 py-3 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
              >
                Explore Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-[80px] bg-rich-black-fogra-29-1 text-white" id="services">
        <div className="max-w-[1140px] mx-auto px-4">
          <p className="font-catamaran text-[1.8rem] font-bold text-coquelicot mb-4 text-center">Our Services</p>
          <h2 className="font-catamaran text-[2.5rem] md:text-[4.5rem] font-extrabold text-white leading-[1.2] mb-8 text-center">
            Fitness Classes & Training in Erode
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300">
                <div className="overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[200px] object-cover"
                  />
                </div>
                <div className="p-6 bg-gainsboro rounded-b-[10px]">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-coquelicot">{service.icon}</span>
                    <h3 className="font-catamaran text-[1.8rem] font-bold text-rich-black-fogra-29-1">
                      <Link to={`/services/${service.id}`} className="hover:text-coquelicot transition-colors duration-300">
                        {service.title}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-[1.3rem] text-sonic-silver mb-4">{service.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[1.2rem] text-sonic-silver">Availability</span>
                    <span className="text-[1.2rem] font-medium text-rich-black-fogra-29-1">{service.availability}%</span>
                  </div>
                  <div className="w-full bg-coquelicot-10 rounded-full h-2">
                    <div
                      className="bg-coquelicot h-full rounded-full"
                      style={{ width: `${service.availability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-[80px] bg-white" id="pricing">
        <div className="max-w-[1140px] mx-auto px-4">
          <p className="font-catamaran text-[1.8rem] font-bold text-coquelicot mb-4 text-center">Membership Pricing</p>
          <h2 className="font-catamaran text-[2.5rem] md:text-[4.5rem] font-extrabold text-rich-black-fogra-29-1 leading-[1.2] mb-8 text-center">
            Affordable Gym Membership in Erode Perundurai
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricing.map((plan) => (
              <div key={plan.id} className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300">
                <div className="p-6 bg-gainsboro rounded-b-[10px]">
                  <h3 className="font-catamaran text-[1.8rem] font-bold text-rich-black-fogra-29-1 mb-3">{plan.title}</h3>
                  <p className="text-[1.3rem] text-sonic-silver mb-3">{plan.description}</p>
                  <div className="text-[2rem] font-bold text-coquelicot mb-4">{plan.price}</div>
                  <ul className="mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 mb-2 text-[1.3rem] text-sonic-silver">
                        <span className="text-coquelicot">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="bg-coquelicot text-white px-6 py-3 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300 inline-block"
                  >
                    Join Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-[80px] bg-gainsboro" id="blog">
        <div className="max-w-[1140px] mx-auto px-4">
          <p className="font-catamaran text-[1.8rem] font-bold text-coquelicot mb-4 text-center">Fitness Tips</p>
          <h2 className="font-catamaran text-[2.5rem] md:text-[4.5rem] font-extrabold text-rich-black-fogra-29-1 leading-[1.2] mb-8 text-center">
            Latest Fitness Blog Posts
          </h2>
          <ul className="flex flex-wrap gap-6 justify-center overflow-x-auto">
            {blogs.map((blog) => (
              <li key={blog.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] animate-fade-in">
                <div className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300">
                  <div className="relative">
        <section className="py-[80px] bg-rich-black-fogra-29-1 text-white" id="services">
          <div className="max-w-[1140px] mx-auto px-4">
            <p className="font-catamaran text-[1.8rem] font-bold text-coquelicot mb-4 text-center">Our Services</p>
            <h2 className="font-catamaran text-[2.5rem] md:text-[4.5rem] font-extrabold text-white leading-[1.2] mb-8 text-center">
              Fitness Classes & Training in Erode
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300">
                  <div className="overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-[200px] object-cover"
                    />
                  </div>
                  <div className="p-6 bg-gainsboro rounded-b-[10px]">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-coquelicot">{service.icon}</span>
                      <h3 className="font-catamaran text-[1.8rem] font-bold text-rich-black-fogra-29-1">
                        <Link to={`/services/${service.id}`} className="hover:text-coquelicot transition-colors duration-300">
                          {service.title}
                        </Link>
                      </h3>
                    </div>
                    <p className="text-[1.3rem] text-sonic-silver mb-4">{service.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[1.2rem] text-sonic-silver">Availability</span>
                      <span className="text-[1.2rem] font-medium text-rich-black-fogra-29-1">{service.availability}%</span>
                    </div>
                    <div className="w-full bg-coquelicot-10 rounded-full h-2">
                      <div
                        className="bg-coquelicot h-full rounded-full"
                        style={{ width: `${service.availability}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-[80px] bg-white" id="pricing">
          <div className="max-w-[1140px] mx-auto px-4">
            <p className="font-catamaran text-[1.8rem] font-bold text-coquelicot mb-4 text-center">Membership Pricing</p>
            <h2 className="font-catamaran text-[2.5rem] md:text-[4.5rem] font-extrabold text-rich-black-fogra-29-1 leading-[1.2] mb-8 text-center">
              Affordable Gym Membership in Erode Perundurai
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pricing.map((plan) => (
                <div key={plan.id} className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300">
                  <div className="p-6 bg-gainsboro rounded-b-[10px]">
                    <h3 className="font-catamaran text-[1.8rem] font-bold text-rich-black-fogra-29-1 mb-3">{plan.title}</h3>
                    <p className="text-[1.3rem] text-sonic-silver mb-3">{plan.description}</p>
                    <div className="text-[2rem] font-bold text-coquelicot mb-4">{plan.price}</div>
                    <ul className="mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 mb-2 text-[1.3rem] text-sonic-silver">
                          <span className="text-coquelicot">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#contact"
                      className="bg-coquelicot text-white px-6 py-3 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300 inline-block"
                    >
                      Join Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-[80px] bg-gainsboro" id="blog">
          <div className="max-w-[1140px] mx-auto px-4">
            <p className="font-catamaran text-[1.8rem] font-bold text-coquelicot mb-4 text-center">Fitness Tips</p>
            <h2 className="font-catamaran text-[2.5rem] md:text-[4.5rem] font-extrabold text-rich-black-fogra-29-1 leading-[1.2] mb-8 text-center">
              Latest Fitness Blog Posts
            </h2>
            <ul className="flex flex-wrap gap-6 justify-center overflow-x-auto">
              {blogs.map((blog) => (
                <li key={blog.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] animate-fade-in">
                  <div className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300">
                    <div className="relative">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-[200px] object-cover rounded-t-[10px]"
                      />
                      <time className="absolute bottom-2 right-2 bg-coquelicot text-white text-[1.2rem] px-2 py-1 rounded-[5px]">{blog.date}</time>
                    </div>
                    <div className="p-6 bg-gainsboro rounded-b-[10px]">
                      <h3 className="font-catamaran text-[1.8rem] font-bold text-rich-black-fogra-29-1 mb-3">
                        <Link to={`/blog/${blog.id}`} className="hover:text-coquelicot transition-colors duration-300">
                          {blog.title}
                        </Link>
                      </h3>
                      <p className="text-[1.3rem] text-sonic-silver mb-4">{blog.description}</p>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="text-coquelicot text-[1.3rem] font-medium hover:underline"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-[80px] bg-white" id="contact">
          <div className="max-w-[1140px] mx-auto px-4">
            <h2 className="font-catamaran text-[2.5rem] md:text-[4.5rem] font-extrabold text-rich-black-fogra-29-1 leading-[1.2] mb-4 text-center">
              Get in Touch with Us
            </h2>
            <p className="text-[1.4rem] text-sonic-silver mb-8 text-center">
              Have questions about our fitness programs or gym facilities? Contact Phoenix Fitness Studio
              in Erode, Tamil Nadu, India, via phone, email, or our form for personalized training support.
              We'll respond promptly.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300 animate-fade-in">
                <div className="p-6 bg-gainsboro rounded-b-[10px]">
                  <h4 className="font-catamaran text-[2rem] font-bold text-rich-black-fogra-29-1 mb-4">Contact Form</h4>
                  <div>
                    <div className="mb-4">
                      <label className="block text-[1.3rem] text-sonic-silver mb-2">Your Name</label>
                      <input
                        type="text"
                        className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 text-[1.4rem] focus:outline-none focus:border-coquelicot"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[1.3rem] text-sonic-silver mb-2">Email Address</label>
                      <input
                        type="email"
                        className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 text-[1.4rem] focus:outline-none focus:border-coquelicot"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[1.3rem] text-sonic-silver mb-2">Contact Number</label>
                      <input
                        type="tel"
                        className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 text-[1.4rem] focus:outline-none focus:border-coquelicot"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[1.3rem] text-sonic-silver mb-2">Your Message</label>
                      <textarea
                        className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 text-[1.4rem] focus:outline-none focus:border-coquelicot"
                        rows="5"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="button"
                      className="bg-coquelicot text-white px-6 py-3 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300 animate-fade-in">
                <div className="p-6 bg-gainsboro rounded-b-[10px]">
                  <h4 className="font-catamaran text-[2rem] font-bold text-rich-black-fogra-29-1 mb-4">Contact Information</h4>
                  <div className="flex items-center gap-3 mb-4">
                    <Phone size={20} className="text-coquelicot" />
                    <p className="text-[1.3rem]">
                      Phone: <a href="tel:+919876543210" className="text-coquelicot hover:underline">+91 9876543210</a>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <Mail size={20} className="text-coquelicot" />
                    <p className="text-[1.3rem]">
                      Email: <a href="mailto:info@phoenixfitnessstudio.com" className="text-coquelicot hover:underline">info@phoenixfitnessstudio.com</a>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin size={20} className="text-coquelicot" />
                    <p className="text-[1.3rem]">Address: Phoenix Fitness Studio and Gym, Erode, Tamil Nadu, India</p>
                  </div>
                  <div className="mt-6">
                    <h5 className="font-catamaran text-[1.6rem] font-bold text-rich-black-fogra-29-1 mb-3">Follow Us</h5>
                    <div className="flex gap-4">
                      <a href="#" className="text-sonic-silver hover:text-coquelicot transition-colors duration-300">
                        <Facebook size={20} />
                      </a>
                      <a href="#" className="text-sonic-silver hover:text-coquelicot transition-colors duration-300">
                        <Instagram size={20} />
                      </a>
                      <a href="#" className="text-sonic-silver hover:text-coquelicot transition-colors duration-300">
                        <Twitter size={20} />
                      </a>
                      <a href="#" className="text-sonic-silver hover:text-coquelicot transition-colors duration-300">
                        <Linkedin size={20} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;