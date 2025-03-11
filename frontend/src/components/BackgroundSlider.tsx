import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface BackgroundImage {
  url: string;
  public_id: string;
}

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

const BackgroundSlider: React.FC = () => {
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/backgrounds`);
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching background images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#f0f0f0'
      }}
    />
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
      />
    </div>
  );
};

export default BackgroundSlider; 