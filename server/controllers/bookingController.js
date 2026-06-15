import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Caregiver from '../models/Caregiver.js';
import User from '../models/User.js';

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 */
export const createBooking = async (req, res) => {
  try {
    const { service, caregiver, bookingDate, bookingTime, duration, address, notes } = req.body;

    const serviceDoc = await Service.findById(service);
    const caregiverDoc = await Caregiver.findById(caregiver);

    if (!serviceDoc) return res.status(404).json({ message: 'Service not found' });
    if (!caregiverDoc) return res.status(404).json({ message: 'Caregiver not found' });
    if (caregiverDoc.availability === 'unavailable') {
      return res.status(400).json({ message: 'Caregiver is currently unavailable' });
    }

    const totalAmount = caregiverDoc.hourlyRate * (duration || 2);

    const booking = await Booking.create({
      user: req.user._id,
      service,
      caregiver,
      bookingDate,
      bookingTime,
      duration: duration || 2,
      address,
      notes,
      totalAmount,
    });

    // Add notification to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        notifications: {
          message: `Your booking for ${serviceDoc.name} has been submitted and is pending confirmation.`,
          type: 'booking',
        },
      },
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('service', 'name price')
      .populate('caregiver', 'name specialization rating')
      .populate('user', 'name email');

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get user's bookings
 * @route   GET /api/bookings/my
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('service', 'name price icon')
      .populate('caregiver', 'name specialization rating avatar')
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single booking
 * @route   GET /api/bookings/:id
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'name price')
      .populate('caregiver', 'name specialization rating phone')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only owner or admin can view
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Cancel booking
 * @route   PUT /api/bookings/:id/cancel
 */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: `Cannot cancel a ${booking.status} booking` });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
