import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, bookingAPI } from '../api/axios';
import Sidebar from '../components/Sidebar';
import BookingCard from '../components/BookingCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [profileForm, setProfileForm] = useState({
    name: '', email: '', phone: '',
    address: { street: '', city: '', state: '', zipCode: '' },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, profileRes] = await Promise.all([
          bookingAPI.getMyBookings(),
          authAPI.getProfile(),
        ]);
        setBookings(bookingsRes.data);
        setProfile(profileRes.data);
        setNotifications(profileRes.data.notifications || []);
        setProfileForm({
          name: profileRes.data.name || '',
          email: profileRes.data.email || '',
          phone: profileRes.data.phone || '',
          address: profileRes.data.address || { street: '', city: '', state: '', zipCode: '' },
        });
      } catch {
        setMessage('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingAPI.cancel(id);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
      setMessage('Booking cancelled successfully');
    } catch {
      setMessage('Failed to cancel booking');
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(profileForm);
      updateUser(data);
      setMessage('Profile updated successfully');
    } catch {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const upcomingBookings = bookings.filter((b) => ['pending', 'confirmed', 'in-progress'].includes(b.status));
  const pastBookings = bookings.filter((b) => ['completed', 'cancelled'].includes(b.status));
  const unreadCount = notifications.filter((n) => !n.read).length;

  const sidebarItems = [
    { id: 'bookings', label: 'My Bookings', icon: '📅' },
    { id: 'upcoming', label: 'Upcoming', icon: '🔔', badge: upcomingBookings.length || null },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'notifications', label: 'Notifications', icon: '💬', badge: unreadCount || null },
    { id: 'profile', label: 'My Profile', icon: '👤' },
  ];

  if (loading) return <LoadingSpinner fullScreen text="Loading dashboard..." />;

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-500">Manage your bookings and profile</p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
            <button onClick={() => setMessage('')} className="float-right text-green-500">✕</button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar items={sidebarItems} activeTab={activeTab} onTabChange={setActiveTab} title="Dashboard" />

          <div className="flex-grow">
            {/* All Bookings */}
            {(activeTab === 'bookings' || activeTab === 'upcoming' || activeTab === 'history') && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {activeTab === 'upcoming' ? 'Upcoming Bookings' : activeTab === 'history' ? 'Booking History' : 'All Bookings'}
                </h2>
                {(() => {
                  const list = activeTab === 'upcoming' ? upcomingBookings : activeTab === 'history' ? pastBookings : bookings;
                  return list.length === 0 ? (
                    <div className="card text-center py-12">
                      <p className="text-gray-500 mb-4">No bookings found</p>
                      <a href="/booking" className="btn-primary">Book a Service</a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {list.map((booking) => (
                        <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} />
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
                {notifications.length === 0 ? (
                  <div className="card text-center py-12 text-gray-500">No notifications yet</div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif, i) => (
                      <div key={i} className={`card flex items-start gap-3 ${!notif.read ? 'border-l-4 border-l-primary-500' : ''}`}>
                        <span className="text-xl">🔔</span>
                        <div>
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">My Profile</h2>
                <form onSubmit={handleProfileSave} className="card space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} className="input-field" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800">Address</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <input type="text" placeholder="Street" value={profileForm.address.street} onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, street: e.target.value } })} className="input-field" />
                    </div>
                    <input type="text" placeholder="City" value={profileForm.address.city} onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, city: e.target.value } })} className="input-field" />
                    <input type="text" placeholder="State" value={profileForm.address.state} onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, state: e.target.value } })} className="input-field" />
                    <input type="text" placeholder="ZIP Code" value={profileForm.address.zipCode} onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, zipCode: e.target.value } })} className="input-field" />
                  </div>
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
