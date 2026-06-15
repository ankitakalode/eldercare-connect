import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Caregiver from '../models/Caregiver.js';
import connectDB from '../config/db.js';

dotenv.config();

const services = [
  {
    name: 'Nursing Care',
    slug: 'nursing-care',
    description:
      'Professional registered nurses provide comprehensive in-home nursing care including medication management, wound care, vital signs monitoring, and post-surgical care for elderly patients.',
    shortDescription: 'Expert nursing care delivered at your doorstep.',
    icon: 'nursing',
    price: 45,
    priceUnit: 'per hour',
    features: ['Medication Management', 'Wound Care', 'Vital Signs Monitoring', 'Post-Surgical Care'],
    duration: '2-8 hours',
  },
  {
    name: 'Physiotherapy',
    slug: 'physiotherapy',
    description:
      'Licensed physiotherapists help seniors regain mobility, reduce pain, and improve strength through personalized exercise programs and therapeutic techniques in the comfort of home.',
    shortDescription: 'Restore mobility and strength with expert physiotherapy.',
    icon: 'physio',
    price: 55,
    priceUnit: 'per hour',
    features: ['Mobility Training', 'Pain Management', 'Balance Exercises', 'Post-Stroke Rehab'],
    duration: '1-2 hours',
  },
  {
    name: 'Elder Companion',
    slug: 'elder-companion',
    description:
      'Compassionate companions provide emotional support, conversation, light housekeeping, meal preparation, and accompaniment for seniors who need social interaction and daily assistance.',
    shortDescription: 'Friendly companionship for your loved ones.',
    icon: 'companion',
    price: 25,
    priceUnit: 'per hour',
    features: ['Social Interaction', 'Meal Preparation', 'Light Housekeeping', 'Accompaniment'],
    duration: '4-12 hours',
  },
  {
    name: 'Medical Assistance',
    slug: 'medical-assistance',
    description:
      'Trained medical attendants assist with daily living activities, hospital visits, medical equipment usage, and coordinate with healthcare providers for seamless elderly care.',
    shortDescription: 'Daily medical support and assistance at home.',
    icon: 'medical',
    price: 35,
    priceUnit: 'per hour',
    features: ['Daily Living Assistance', 'Hospital Visits', 'Medical Equipment Help', 'Health Coordination'],
    duration: '4-8 hours',
  },
  {
    name: 'Emergency Support',
    slug: 'emergency-support',
    description:
      '24/7 emergency response team available for urgent medical situations, fall assistance, and immediate caregiver dispatch for seniors in critical need of help.',
    shortDescription: 'Round-the-clock emergency care when you need it most.',
    icon: 'emergency',
    price: 75,
    priceUnit: 'per visit',
    features: ['24/7 Availability', 'Fall Assistance', 'Emergency Dispatch', 'First Aid Response'],
    duration: 'On-demand',
  },
];

const caregivers = [
  {
    name: 'Dr. Sarah Mitchell',
    email: 'sarah.mitchell@eldercare.com',
    phone: '+1 (555) 101-2001',
    specialization: 'Nursing Care',
    experience: 12,
    rating: 4.9,
    totalReviews: 156,
    bio: 'Registered Nurse with 12 years of experience in geriatric care and palliative nursing.',
    qualifications: ['RN License', 'Geriatric Care Certification', 'CPR Certified'],
    availability: 'available',
    hourlyRate: 45,
    languages: ['English', 'Spanish'],
    isVerified: true,
  },
  {
    name: 'James Rodriguez',
    email: 'james.rodriguez@eldercare.com',
    phone: '+1 (555) 101-2002',
    specialization: 'Physiotherapy',
    experience: 8,
    rating: 4.8,
    totalReviews: 98,
    bio: 'Licensed physiotherapist specializing in senior mobility and post-stroke rehabilitation.',
    qualifications: ['DPT', 'Senior Fitness Specialist', 'Neurological Rehab Certified'],
    availability: 'available',
    hourlyRate: 55,
    languages: ['English'],
    isVerified: true,
  },
  {
    name: 'Maria Chen',
    email: 'maria.chen@eldercare.com',
    phone: '+1 (555) 101-2003',
    specialization: 'Elder Companion',
    experience: 6,
    rating: 4.7,
    totalReviews: 72,
    bio: 'Warm and patient companion with a background in social work, dedicated to enriching seniors lives.',
    qualifications: ['Social Work Degree', 'Dementia Care Training'],
    availability: 'available',
    hourlyRate: 25,
    languages: ['English', 'Mandarin', 'Cantonese'],
    isVerified: true,
  },
  {
    name: 'Robert Thompson',
    email: 'robert.thompson@eldercare.com',
    phone: '+1 (555) 101-2004',
    specialization: 'Medical Assistance',
    experience: 10,
    rating: 4.6,
    totalReviews: 134,
    bio: 'Certified medical attendant with extensive experience in home healthcare and chronic disease management.',
    qualifications: ['CNA License', 'Diabetes Care Specialist', 'First Aid Certified'],
    availability: 'busy',
    hourlyRate: 35,
    languages: ['English'],
    isVerified: true,
  },
  {
    name: 'Lisa Anderson',
    email: 'lisa.anderson@eldercare.com',
    phone: '+1 (555) 101-2005',
    specialization: 'Emergency Support',
    experience: 15,
    rating: 4.9,
    totalReviews: 201,
    bio: 'Emergency response specialist and paramedic with 15 years of experience in senior emergency care.',
    qualifications: ['EMT-P License', 'Emergency Response Certified', 'Trauma Care Specialist'],
    availability: 'available',
    hourlyRate: 75,
    languages: ['English', 'French'],
    isVerified: true,
  },
  {
    name: 'David Park',
    email: 'david.park@eldercare.com',
    phone: '+1 (555) 101-2006',
    specialization: 'Nursing Care',
    experience: 7,
    rating: 4.5,
    totalReviews: 89,
    bio: 'Compassionate nurse focused on dementia care and end-of-life comfort for elderly patients.',
    qualifications: ['RN License', 'Dementia Care Certified', 'Hospice Care Training'],
    availability: 'available',
    hourlyRate: 42,
    languages: ['English', 'Korean'],
    isVerified: true,
  },
  {
    name: 'Emily Watson',
    email: 'emily.watson@eldercare.com',
    phone: '+1 (555) 101-2007',
    specialization: 'Physiotherapy',
    experience: 5,
    rating: 4.7,
    totalReviews: 56,
    bio: 'Young and energetic physiotherapist passionate about helping seniors stay active and independent.',
    qualifications: ['DPT', 'Fall Prevention Specialist'],
    availability: 'available',
    hourlyRate: 50,
    languages: ['English'],
    isVerified: true,
  },
  {
    name: 'Patricia Hughes',
    email: 'patricia.hughes@eldercare.com',
    phone: '+1 (555) 101-2008',
    specialization: 'Elder Companion',
    experience: 9,
    rating: 4.8,
    totalReviews: 112,
    bio: 'Retired teacher who brings patience, warmth, and engaging activities to every companion session.',
    qualifications: ['Elder Care Certification', 'Activity Planning Specialist'],
    availability: 'unavailable',
    hourlyRate: 28,
    languages: ['English', 'German'],
    isVerified: true,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Service.deleteMany();
    await Caregiver.deleteMany();

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@eldercare.com',
      password: 'admin123',
      phone: '+1 (555) 000-0001',
      role: 'admin',
    });

    // Create sample user
    await User.create({
      name: 'John Family',
      email: 'user@eldercare.com',
      password: 'user123',
      phone: '+1 (555) 000-0002',
      address: {
        street: '123 Oak Street',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
      },
      role: 'user',
      notifications: [
        {
          message: 'Welcome to ElderCare Connect! Book your first service today.',
          type: 'info',
          read: false,
        },
      ],
    });

    // Seed services and caregivers
    await Service.insertMany(services);
    await Caregiver.insertMany(caregivers);

    console.log('✅ Database seeded successfully!');
    console.log('📧 Admin login: admin@eldercare.com / admin123');
    console.log('📧 User login:  user@eldercare.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
