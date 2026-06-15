import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-primary-100 text-lg">We're here to help. Reach out anytime.</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary mt-4">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange} className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={5} className="input-field" required />
                  </div>
                  <button type="submit" className="btn-primary w-full">Send Message</button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { icon: '📞', title: 'Phone', lines: ['+1 (800) 555-CARE', '+1 (555) 123-4567'], sub: 'Mon-Fri 8AM-8PM, Sat 9AM-5PM' },
                { icon: '✉️', title: 'Email', lines: ['support@eldercare.com', 'info@eldercare.com'], sub: 'We respond within 24 hours' },
                { icon: '📍', title: 'Address', lines: ['456 Healthcare Blvd, Suite 100', 'Springfield, IL 62701, USA'], sub: '' },
              ].map((item) => (
                <div key={item.title} className="card flex items-start gap-4">
                  <div className="text-3xl">{item.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    {item.lines.map((line) => (
                      <p key={line} className="text-gray-600 text-sm">{line}</p>
                    ))}
                    {item.sub && <p className="text-xs text-gray-400 mt-1">{item.sub}</p>}
                  </div>
                </div>
              ))}

              {/* Map Placeholder */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-3">Our Location</h3>
                <div className="bg-primary-50 rounded-xl h-48 flex items-center justify-center border-2 border-dashed border-primary-200">
                  <div className="text-center text-primary-400">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-sm font-medium">Google Map Placeholder</p>
                    <p className="text-xs">456 Healthcare Blvd, Springfield, IL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
