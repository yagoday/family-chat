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
    const result = await cloudinary.search
      .expression('folder:yagodas/*')
      .max_results(500)
      .execute();
    
    const images = result.resources.map((resource: any) => ({
      url: resource.secure_url,
      public_id: resource.public_id
    }));

    console.log('Found background images:', images.length);
    res.json(images);
  } catch (error) {
    console.error('Error fetching background images:', error);
    res.status(500).json({ message: 'Error fetching background images' });
  }
});

export default router; 