import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    shortDescription: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'heart',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    priceUnit: {
      type: String,
      default: 'per hour',
    },
    features: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: String,
      default: 'Flexible',
    },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
