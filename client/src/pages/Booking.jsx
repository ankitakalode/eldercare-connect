import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { serviceAPI, caregiverAPI, bookingAPI } from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    service: searchParams.get('service') || '',
    caregiver: searchParams.get('caregiver') || '',
    bookingDate: '',
    bookingTime: '',
    duration: 2,
    address: { street: '', city: '', state: '', zipCode: '', notes: '' },
    notes: '',
  });

  useEffect(() => {
    Promise.all([serviceAPI.getAll(), caregiverAPI.getAll()])
      .then(([servicesRes, caregiversRes]) => {
        setServices(servicesRes.data);
        setCaregivers(caregiversRes.data.filter((c) => c.availability !== 'unavailable'));
      })
      .catch(() => setError('Failed to load booking data'))
      .finally(() => setLoading(false));
  }, []);

  const selectedService = services.find((s) => s._id === form.service);
  const selectedCaregiver = caregivers.find((c) => c._id === form.caregiver);
  const totalAmount = selectedCaregiver ? selectedCaregiver.hourlyRate * form.duration : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep = () => {
    if (step === 1 && !form.service) { setError('Please select a service'); return false; }
    if (step === 2 && !form.caregiver) { setError('Please select a caregiver'); return false; }
    if (step === 3) {
      if (!form.bookingDate || !form.bookingTime) { setError('Please select date and time'); return false; }
      const { street, city, state, zipCode } = form.address;
      if (!street || !city || !state || !zipCode) { setError('Please fill in the complete address'); return false; }
    }
    setError(null);
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep((s) => s + 1); };
  const prevStep = () => { setError(null); setStep((s) => s - 1); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    setError(null);
    try {
      await bookingAPI.create(form);
      setConfirmed(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading booking form..." />;

  if (confirmed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your booking has been submitted successfully. You will receive a confirmation notification shortly.
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/dashboard')} className="btn-primary">View Dashboard</button>
            <button onClick={() => { setConfirmed(false); setStep(1); setForm({ service: '', caregiver: '', bookingDate: '', bookingTime: '', duration: 2, address: { street: '', city: '', state: '', zipCode: '', notes: '' }, notes: '' }); }} className="btn-secondary">Book Another</button>
          </div>
        </div>
      </div>
    );
  }

  const steps = ['Select Service', 'Choose Caregiver', 'Date & Address', 'Confirm'];

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Book a Service</h1>
        <p className="text-gray-500 text-center mb-8">Complete the steps below to schedule care for your loved one</p>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`hidden sm:block text-xs ml-1 mr-3 ${step === i + 1 ? 'text-primary-600 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="card">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Service Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Select a Service</h2>
              <div className="space-y-3">
                {services.map((service) => (
                  <label
                    key={service._id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      form.service === service._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={service._id}
                      checked={form.service === service._id}
                      onChange={handleChange}
                      className="text-primary-600"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.shortDescription}</p>
                    </div>
                    <span className="font-bold text-primary-600">${service.price}/{service.priceUnit}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Caregiver Selection */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Choose a Caregiver</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {caregivers
                  .filter((c) => !selectedService || c.specialization === selectedService.name)
                  .map((caregiver) => (
                    <label
                      key={caregiver._id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        form.caregiver === caregiver._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="caregiver"
                        value={caregiver._id}
                        checked={form.caregiver === caregiver._id}
                        onChange={handleChange}
                      />
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600">
                        {caregiver.name.charAt(0)}
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold">{caregiver.name}</p>
                        <p className="text-sm text-gray-500">{caregiver.specialization} · {caregiver.experience} yrs · ★ {caregiver.rating}</p>
                      </div>
                      <span className="font-bold text-primary-600">${caregiver.hourlyRate}/hr</span>
                    </label>
                  ))}
              </div>
            </div>
          )}

          {/* Step 3: Date, Time & Address */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Schedule & Location</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" name="bookingDate" value={form.bookingDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input type="time" name="bookingTime" value={form.bookingTime} onChange={handleChange} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                  <select name="duration" value={form.duration} onChange={handleChange} className="input-field">
                    {[1, 2, 3, 4, 6, 8].map((h) => (
                      <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-3">Service Address</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <input type="text" name="address.street" placeholder="Street Address" value={form.address.street} onChange={handleChange} className="input-field" required />
                </div>
                <input type="text" name="address.city" placeholder="City" value={form.address.city} onChange={handleChange} className="input-field" required />
                <input type="text" name="address.state" placeholder="State" value={form.address.state} onChange={handleChange} className="input-field" required />
                <input type="text" name="address.zipCode" placeholder="ZIP Code" value={form.address.zipCode} onChange={handleChange} className="input-field" required />
                <div className="sm:col-span-2">
                  <textarea name="address.notes" placeholder="Special instructions (optional)" value={form.address.notes} onChange={handleChange} className="input-field" rows={2} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
              <div className="bg-primary-50 rounded-xl p-6 space-y-3">
                <div className="flex justify-between"><span className="text-gray-600">Service</span><span className="font-semibold">{selectedService?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Caregiver</span><span className="font-semibold">{selectedCaregiver?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Date & Time</span><span className="font-semibold">{form.bookingDate} at {form.bookingTime}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Duration</span><span className="font-semibold">{form.duration} hour(s)</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Address</span><span className="font-semibold text-right">{form.address.street}, {form.address.city}</span></div>
                <div className="border-t border-primary-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">${totalAmount}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={prevStep} className="btn-outline">← Back</button>
            ) : <div />}
            {step < 4 ? (
              <button onClick={nextStep} className="btn-primary">Continue →</button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary disabled:opacity-50">
                {submitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
