import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={`fixed bottom-8 right-8 z-[999] flex items-center justify-center w-[50px] h-[50px] rounded-full bg-coquelicot text-white shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:bg-rich-black-fogra-29-1 transition-all duration-300 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0 pointer-events-none'}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ChevronUp size={24} />
    </button>
  );
};

export default BackToTop;