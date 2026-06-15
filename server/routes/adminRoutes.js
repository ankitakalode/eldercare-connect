import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllBookings,
  updateBookingStatus,
  getAllCaregiversAdmin,
  markNotificationRead,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id', updateBookingStatus);
router.get('/caregivers', getAllCaregiversAdmin);
router.put('/notifications/:id/read', markNotificationRead);

export default router;
