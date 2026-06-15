import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { useState, useEffect } from 'react';
import { serviceAPI } from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceAPI.getAll()
      .then(({ data }) => setServices(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const testimonials = [
    {
      name: 'Margaret Johnson',
      role: 'Daughter of Patient',
      text: 'ElderCare Connect found us the perfect nurse for my 85-year-old mother. The care has been exceptional and gives our whole family peace of mind.',
      rating: 5,
    },
    {
      name: 'Robert Chen',
      role: 'Family Member',
      text: 'After my father\'s stroke, the physiotherapist assigned through this platform helped him regain mobility faster than we ever expected. Truly life-changing.',
      rating: 5,
    },
    {
      name: 'Susan Williams',
      role: 'Caregiver Client',
      text: 'The companion service has been a blessing. My lonely aunt now has someone to talk to, play games with, and share meals. She looks forward to every visit.',
      rating: 5,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary-500/30 text-primary-100 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                🏥 Trusted Healthcare Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Compassionate Care for Your{' '}
                <span className="text-primary-200">Loved Ones</span>
              </h1>
              <p className="text-primary-100 text-lg mb-8 leading-relaxed">
                Connect with verified nurses, caregivers, and healthcare professionals for professional in-home elderly care services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/booking" className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-8 rounded-lg transition-all shadow-lg text-center">
                  Book a Caregiver
                </Link>
                <Link to="/services" className="border-2 border-white/50 hover:border-white text-white font-semibold py-3 px-8 rounded-lg transition-all text-center">
                  Explore Services
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-10">
                {[
                  { num: '500+', label: 'Caregivers' },
                  { num: '10K+', label: 'Families Served' },
                  { num: '4.9★', label: 'Average Rating' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold">{stat.num}</p>
                    <p className="text-primary-200 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {['🏥 Nursing', '🏃 Physio', '🤝 Companion', '🚨 Emergency'].map((item) => (
                    <div key={item} className="bg-white/10 rounded-xl p-4 text-center font-medium">
                      {item}
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-white/20 rounded-xl p-4 text-center">
                  <p className="text-sm text-primary-100">Available 24/7 for Emergency Support</p>
                  <p className="text-2xl font-bold mt-1">+1 (800) 555-CARE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">About ElderCare Connect</h2>
            <p className="section-subtitle">
              We bridge the gap between families and professional healthcare providers, ensuring seniors receive the best care at home.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '✅', title: 'Verified Professionals', desc: 'All caregivers are background-checked, licensed, and verified by our team.' },
              { icon: '🏠', title: 'In-Home Care', desc: 'Professional healthcare delivered in the comfort and familiarity of home.' },
              { icon: '📱', title: 'Easy Booking', desc: 'Book services in minutes with our simple, intuitive booking platform.' },
              { icon: '💙', title: 'Compassionate Care', desc: 'Our caregivers are selected for their empathy, patience, and dedication.' },
              { icon: '📊', title: 'Real-time Tracking', desc: 'Track booking status and receive notifications every step of the way.' },
              { icon: '🔒', title: 'Secure Platform', desc: 'Your data and payments are protected with industry-standard security.' },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">Comprehensive healthcare services tailored for senior citizens</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size="lg" text="Loading services..." /></div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/services" className="btn-primary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">What Families Say</h2>
            <p className="section-subtitle">Real stories from families who trust ElderCare Connect</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }, (_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Give Your Loved Ones the Best Care?</h2>
          <p className="text-primary-200 text-lg mb-8">
            Join thousands of families who trust ElderCare Connect for professional, compassionate elderly care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="bg-white text-primary-700 hover:bg-primary-50 font-bold py-3 px-8 rounded-lg transition-all">
              Get Started Free
            </Link>
            <Link to="/caregivers" className="border-2 border-white/50 hover:border-white font-semibold py-3 px-8 rounded-lg transition-all">
              Browse Caregivers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
