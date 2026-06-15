import express from 'express';
import {
  getCaregivers,
  getCaregiverById,
  createCaregiver,
  updateCaregiver,
  deleteCaregiver,
} from '../controllers/caregiverController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getCaregivers);
router.get('/:id', getCaregiverById);
router.post('/', protect, adminOnly, createCaregiver);
router.put('/:id', protect, adminOnly, updateCaregiver);
router.delete('/:id', protect, adminOnly, deleteCaregiver);

export default router;
