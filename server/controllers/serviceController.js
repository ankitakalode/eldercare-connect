import Service from '../models/Service.js';

/**
 * @desc    Get all services
 * @route   GET /api/services
 */
export const getServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get single service by ID or slug
 * @route   GET /api/services/:id
 */
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isActive: true,
    });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Create service (admin)
 * @route   POST /api/services
 */
export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Update service (admin)
 * @route   PUT /api/services/:id
 */
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Delete service (admin)
 * @route   DELETE /api/services/:id
 */
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
