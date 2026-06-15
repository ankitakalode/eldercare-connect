import Caregiver from '../models/Caregiver.js';

/**
 * @desc    Get all caregivers with optional filters
 * @route   GET /api/caregivers
 */
export const getCaregivers = async (req, res) => {
  try {
    const { search, specialization, availability } = req.query;
    const filter = { isActive: true };

    if (specialization) filter.specialization = specialization;
    if (availability) filter.availability = availability;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    const caregivers = await Caregiver.find(filter).sort({ rating: -1 });
    res.json(caregivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single caregiver
 * @route   GET /api/caregivers/:id
 */
export const getCaregiverById = async (req, res) => {
  try {
    const caregiver = await Caregiver.findById(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    res.json(caregiver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create caregiver (admin)
 * @route   POST /api/caregivers
 */
export const createCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.create(req.body);
    res.status(201).json(caregiver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Update caregiver (admin)
 * @route   PUT /api/caregivers/:id
 */
export const updateCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    res.json(caregiver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete caregiver (admin)
 * @route   DELETE /api/caregivers/:id
 */
export const deleteCaregiver = async (req, res) => {
  try {
    const caregiver = await Caregiver.findByIdAndDelete(req.params.id);
    if (!caregiver) {
      return res.status(404).json({ message: 'Caregiver not found' });
    }
    res.json({ message: 'Caregiver removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
