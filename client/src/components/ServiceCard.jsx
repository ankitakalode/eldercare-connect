import { Link } from 'react-router-dom';

const ServiceCard = ({ service }) => {
  const iconMap = {
    nursing: '🏥',
    physio: '🏃',
    companion: '🤝',
    medical: '💊',
    emergency: '🚨',
  };

  return (
    <div className="card group hover:border-primary-200">
      <div className="text-4xl mb-4">{iconMap[service.icon] || '❤️'}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
        {service.name}
      </h3>
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{service.shortDescription}</p>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl font-bold text-primary-600">${service.price}</span>
          <span className="text-gray-500 text-sm ml-1">/{service.priceUnit}</span>
        </div>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{service.duration}</span>
      </div>
      {service.features && (
        <ul className="space-y-1 mb-5">
          {service.features.slice(0, 3).map((feature, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
              <span className="text-primary-500">✓</span> {feature}
            </li>
          ))}
        </ul>
      )}
      <Link
        to={`/booking?service=${service._id}`}
        className="btn-primary w-full text-center text-sm block"
      >
        Book Service
      </Link>
    </div>
  );
};

export default ServiceCard;
