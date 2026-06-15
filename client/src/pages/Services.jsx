import { useState, useEffect } from 'react';
import { serviceAPI } from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    serviceAPI.getAll()
      .then(({ data }) => setServices(data))
      .catch(() => setError('Failed to load services. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Healthcare Services</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Professional, compassionate care services designed specifically for senior citizens and their families.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" text="Loading services..." />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
          <p className="text-gray-600 mb-8">
            All prices shown are starting rates. Final pricing depends on caregiver experience, service duration, and specific care requirements. No hidden fees.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { label: 'No Booking Fee', icon: '✅' },
              { label: 'Cancel Anytime', icon: '🔄' },
              { label: 'Insurance Accepted', icon: '🏥' },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-primary-50 rounded-xl">
                <div className="text-2xl mb-2">{item.icon}</div>
                <p className="font-medium text-gray-800">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
