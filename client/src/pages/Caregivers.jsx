import { useState, useEffect } from 'react';
import { caregiverAPI } from '../api/axios';
import CaregiverCard from '../components/CaregiverCard';
import LoadingSpinner from '../components/LoadingSpinner';

const specializations = [
  'All',
  'Nursing Care',
  'Physiotherapy',
  'Elder Companion',
  'Medical Assistance',
  'Emergency Support',
];

const Caregivers = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('All');
  const [availability, setAvailability] = useState('');

  const fetchCaregivers = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (specialization !== 'All') params.specialization = specialization;
      if (availability) params.availability = availability;

      const { data } = await caregiverAPI.getAll(params);
      setCaregivers(data);
    } catch {
      setError('Failed to load caregivers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaregivers();
  }, [specialization, availability]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCaregivers();
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Find Your Caregiver</h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Browse our network of verified, experienced healthcare professionals ready to care for your loved ones.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="input-field md:w-48"
            >
              {specializations.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="input-field md:w-40"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
            </select>
            <button type="submit" className="btn-primary whitespace-nowrap">Search</button>
          </form>
        </div>
      </section>

      {/* Caregivers Grid */}
      <section className="py-12 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" text="Finding caregivers..." />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button onClick={fetchCaregivers} className="btn-primary">Retry</button>
            </div>
          ) : caregivers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No caregivers found matching your criteria.</p>
              <button
                onClick={() => { setSearch(''); setSpecialization('All'); setAvailability(''); }}
                className="btn-primary mt-4"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-500 text-sm mb-6">{caregivers.length} caregiver(s) found</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {caregivers.map((caregiver) => (
                  <CaregiverCard key={caregiver._id} caregiver={caregiver} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Caregivers;
