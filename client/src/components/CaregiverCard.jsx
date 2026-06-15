import { Link } from 'react-router-dom';

const CaregiverCard = ({ caregiver }) => {
  const availabilityColors = {
    available: 'bg-green-100 text-green-700',
    busy: 'bg-yellow-100 text-yellow-700',
    unavailable: 'bg-red-100 text-red-700',
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  return (
    <div className="card group hover:border-primary-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-600 flex-shrink-0">
          {caregiver.name.charAt(0)}
        </div>
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                {caregiver.name}
              </h3>
              <p className="text-sm text-primary-600 font-medium">{caregiver.specialization}</p>
            </div>
            {caregiver.isVerified && (
              <span className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-medium">
                ✓ Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{caregiver.bio}</p>

      <div className="flex items-center gap-1 mb-2">
        {renderStars(caregiver.rating)}
        <span className="text-sm font-semibold text-gray-700 ml-1">{caregiver.rating}</span>
        <span className="text-xs text-gray-400">({caregiver.totalReviews} reviews)</span>
      </div>

      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-gray-600">🎓 {caregiver.experience} yrs experience</span>
        <span className="font-semibold text-primary-600">${caregiver.hourlyRate}/hr</span>
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${availabilityColors[caregiver.availability]}`}>
          {caregiver.availability}
        </span>
        <Link
          to={`/booking?caregiver=${caregiver._id}`}
          className="btn-primary text-sm py-1.5 px-4"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default CaregiverCard;
