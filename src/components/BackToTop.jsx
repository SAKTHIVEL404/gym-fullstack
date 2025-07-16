import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-4 shadow-lg ${
        isVisible ? 'd-inline-flex' : 'd-none'
      }`}
      aria-label="Back to top"
      style={{ zIndex: 1050, width: '48px', height: '48px', alignItems: 'center', justifyContent: 'center' }}
    >
      <ChevronUp size={20} />
    </button>
  );
};

export default BackToTop;
