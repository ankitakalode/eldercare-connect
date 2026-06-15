import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Caregiver from '../models/Caregiver.js';
import Service from '../models/Service.js';

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/admin/stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCaregivers = await Caregiver.countDocuments({ isActive: true });
    const totalBookings = await Booking.countDocuments();
    const totalServices = await Service.countDocuments({ isActive: true });

    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    const recentBookings = await Booking.find()
      .populate('user', 'name email')
      .populate('service', 'name')
      .populate('caregiver', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalCaregivers,
        totalBookings,
        totalServices,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
      },
      recentBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all bookings (admin)
 * @route   GET /api/admin/bookings
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('service', 'name price')
      .populate('caregiver', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Update booking status
 * @route   PUT /api/admin/bookings/:id
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('service', 'name')
      .populate('caregiver', 'name');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Notify user of status change
    await User.findByIdAndUpdate(booking.user._id, {
      $push: {
        notifications: {
          message: `Your booking status has been updated to: ${status}`,
          type: 'status',
        },
      },
    });

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get all caregivers (admin - includes inactive)
 * @route   GET /api/admin/caregivers
 */
export const getAllCaregiversAdmin = async (req, res) => {
  try {
    const caregivers = await Caregiver.find().sort({ createdAt: -1 });
    res.json(caregivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Mark notification as read
 * @route   PUT /api/admin/notifications/:id/read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const notification = user.notifications.id(req.params.id);
    if (notification) {
      notification.read = true;
      await user.save();
    }
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
