import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Seo = ({ title, description, image, keywords }) => {
  const location = useLocation();
  const siteUrl = 'https://your-domain.com'; // Replace with your actual domain
  const defaultTitle = 'Phoenix Fitness Studio - Premium Gym & Fitness Center';
  const defaultDescription = 'Join Phoenix Fitness Studio for premium gym facilities, group classes, and personalized training programs. Get fit with our expert trainers and state-of-the-art equipment.';
  const defaultImage = `${siteUrl}/images/default-share.jpg`;
  const defaultKeywords = 'gym, fitness, workout, personal training, group classes, fitness center';

  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoKeywords = keywords || defaultKeywords;

  useEffect(() => {
    document.title = seoTitle;
    
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = seoDescription;
    document.head.appendChild(metaDescription);

    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = seoKeywords;
    document.head.appendChild(metaKeywords);

    // Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.property = 'og:title';
    ogTitle.content = seoTitle;
    document.head.appendChild(ogTitle);

    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.property = 'og:description';
    ogDescription.content = seoDescription;
    document.head.appendChild(ogDescription);

    const ogImage = document.querySelector('meta[property="og:image"]') || document.createElement('meta');
    ogImage.property = 'og:image';
    ogImage.content = seoImage;
    document.head.appendChild(ogImage);

    // Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]') || document.createElement('meta');
    twitterTitle.name = 'twitter:title';
    twitterTitle.content = seoTitle;
    document.head.appendChild(twitterTitle);

    const twitterDescription = document.querySelector('meta[name="twitter:description"]') || document.createElement('meta');
    twitterDescription.name = 'twitter:description';
    twitterDescription.content = seoDescription;
    document.head.appendChild(twitterDescription);

    const twitterImage = document.querySelector('meta[name="twitter:image"]') || document.createElement('meta');
    twitterImage.name = 'twitter:image';
    twitterImage.content = seoImage;
    document.head.appendChild(twitterImage);

    return () => {
      // Cleanup
      document.title = defaultTitle;
      document.head.removeChild(metaDescription);
      document.head.removeChild(metaKeywords);
      document.head.removeChild(ogTitle);
      document.head.removeChild(ogDescription);
      document.head.removeChild(ogImage);
      document.head.removeChild(twitterTitle);
      document.head.removeChild(twitterDescription);
      document.head.removeChild(twitterImage);
    };
  }, [seoTitle, seoDescription, seoImage, seoKeywords]);

  return null;
};

export default Seo;
