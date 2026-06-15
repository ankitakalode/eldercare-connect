import mongoose from 'mongoose';

const caregiverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Caregiver name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        'Nursing Care',
        'Physiotherapy',
        'Elder Companion',
        'Medical Assistance',
        'Emergency Support',
      ],
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      default: '',
    },
    qualifications: [String],
    availability: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available',
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    languages: [String],
    isVerified: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Caregiver = mongoose.model('Caregiver', caregiverSchema);
export default Caregiver;
