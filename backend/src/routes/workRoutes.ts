import { Router } from 'express';
import { createWork, getWorks, getWorkById, deleteWork, confirmWork } from '../controllers/workController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getWorks);
router.get('/:id', getWorkById);
router.post('/', authenticate, upload.single('file'), createWork);
router.post('/confirm', authenticate, confirmWork);
router.delete('/:id', authenticate, deleteWork);

export default router;
