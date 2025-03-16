import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface BackgroundImage {
  url: string;
  public_id: string;
  loaded?: boolean;
}

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

const BackgroundSlider: React.FC = () => {
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle image load error
  const handleImageError = useCallback((failedImageUrl: string) => {
    console.error(`Failed to load image: ${failedImageUrl}`);
    // Filter out the failed image
    setImages(prevImages => prevImages.filter(img => img.url !== failedImageUrl));
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        console.log('Fetching background images...');
        const response = await axios.get(`${API_URL}/backgrounds`);
        console.log(`Received ${response.data.length} background images`);
        
        // Filter out any problematic images if needed
        const validImages = response.data.filter((img: BackgroundImage) => img.url && img.public_id);
        
        setImages(validImages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching background images:', error);
        setError('Failed to load background images');
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) {
      return;
    }

    console.log(`Starting background rotation with ${images.length} images`);
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (loading) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>Loading backgrounds...</p>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p>{error || 'No background images available'}</p>
      </div>
    );
  }

  const currentImageUrl = images[currentIndex]?.url;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <img
        src={currentImageUrl}
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: 1,
          transition: 'opacity 1s ease-in-out',
        }}
        onError={() => handleImageError(currentImageUrl)}
      />
    </div>
  );
};

export default BackgroundSlider; 