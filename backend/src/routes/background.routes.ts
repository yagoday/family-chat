import { Router } from 'express';
import cloudinary from '../config/cloudinary';

const router = Router();

// Route to list all folders
router.get('/folders', async (req, res) => {
  try {
    const result = await cloudinary.api.root_folders();
    console.log('Available Cloudinary folders:', result.folders);
    res.json(result.folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ message: 'Error fetching folders' });
  }
});

router.get('/backgrounds', async (req, res) => {
  try {
    console.log('Received request for background images');
    
    // First, list all folders to see what's available
    const folders = await cloudinary.api.root_folders();
    console.log('Available Cloudinary folders:', folders.folders.map((f: any) => f.name));
    
    // Use a more generic search expression and increase max_results to 1500
    const result = await cloudinary.search
      .expression('resource_type:image')
      .max_results(1500)
      .execute();
    
    console.log('Cloudinary search result:', {
      total: result.total_count,
      resourcesCount: result.resources.length
    });
    
    if (!result.resources || result.resources.length === 0) {
      console.log('No resources found in Cloudinary');
      return res.json([]);
    }
    
    const images = result.resources.map((resource: any) => {
      // For HEIC images, add a format conversion parameter to the URL
      let url = resource.secure_url;
      if (url.toLowerCase().endsWith('.heic')) {
        // Add Cloudinary transformation to convert HEIC to JPEG
        url = url.replace('/upload/', '/upload/f_jpg/');
      }
      
      return {
        url,
        public_id: resource.public_id
      };
    });

    // Randomize the order of images using Fisher-Yates shuffle algorithm
    const shuffledImages = [...images];
    for (let i = shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
    }

    console.log('Found background images:', shuffledImages.length);
    res.json(shuffledImages);
  } catch (error) {
    console.error('Error fetching background images:', error);
    res.status(500).json({ message: 'Error fetching background images' });
  }
});

export default router; 