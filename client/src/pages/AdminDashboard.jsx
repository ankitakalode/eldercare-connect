import { useState, useEffect } from 'react';
import { adminAPI } from '../api/axios';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, bookingsRes, caregiversRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getBookings(),
        adminAPI.getCaregivers(),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
      setCaregivers(caregiversRes.data);
    } catch {
      setMessage('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminAPI.updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status } : b));
      setMessage(`Booking status updated to ${status}`);
    } catch {
      setMessage('Failed to update status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setMessage('User deleted');
    } catch {
      setMessage('Failed to delete user');
    }
  };

  const handleDeleteCaregiver = async (id) => {
    if (!window.confirm('Delete this caregiver?')) return;
    try {
      await adminAPI.deleteCaregiver(id);
      setCaregivers((prev) => prev.filter((c) => c._id !== id));
      setMessage('Caregiver deleted');
    } catch {
      setMessage('Failed to delete caregiver');
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'bookings', label: 'Bookings', icon: '📅', badge: stats?.stats?.pendingBookings || null },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'caregivers', label: 'Caregivers', icon: '🏥' },
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading admin panel..." />;

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage users, caregivers, and bookings</p>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
            <button onClick={() => setMessage('')} className="float-right">✕</button>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar items={sidebarItems} activeTab={activeTab} onTabChange={setActiveTab} title="Admin Panel" />

          <div className="flex-grow">
            {/* Overview */}
            {activeTab === 'overview' && stats && (
              <div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Users', value: stats.stats.totalUsers, icon: '👥', color: 'bg-blue-500' },
                    { label: 'Caregivers', value: stats.stats.totalCaregivers, icon: '🏥', color: 'bg-green-500' },
                    { label: 'Total Bookings', value: stats.stats.totalBookings, icon: '📅', color: 'bg-purple-500' },
                    { label: 'Pending', value: stats.stats.pendingBookings, icon: '⏳', color: 'bg-yellow-500' },
                  ].map((card) => (
                    <div key={card.label} className="card">
                      <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center text-white text-lg mb-3`}>
                        {card.icon}
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                      <p className="text-sm text-gray-500">{card.label}</p>
                    </div>
                  ))}
                </div>

                {/* Booking Statistics */}
                <div className="card mb-6">
                  <h3 className="font-bold text-gray-900 mb-4">Booking Statistics</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Confirmed', value: stats.stats.confirmedBookings, color: 'text-blue-600' },
                      { label: 'Completed', value: stats.stats.completedBookings, color: 'text-green-600' },
                      { label: 'Cancelled', value: stats.stats.cancelledBookings, color: 'text-red-600' },
                      { label: 'Services', value: stats.stats.totalServices, color: 'text-purple-600' },
                    ].map((s) => (
                      <div key={s.label} className="text-center p-3 bg-gray-50 rounded-lg">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="card">
                  <h3 className="font-bold text-gray-900 mb-4">Recent Bookings</h3>
                  {stats.recentBookings?.length === 0 ? (
                    <p className="text-gray-500 text-sm">No bookings yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 border-b">
                            <th className="pb-2">User</th>
                            <th className="pb-2">Service</th>
                            <th className="pb-2">Caregiver</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentBookings?.map((b) => (
                            <tr key={b._id} className="border-b border-gray-50">
                              <td className="py-2">{b.user?.name}</td>
                              <td className="py-2">{b.service?.name}</td>
                              <td className="py-2">{b.caregiver?.name}</td>
                              <td className="py-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[b.status]}`}>
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Management */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Manage Bookings ({bookings.length})</h2>
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="card">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{booking.service?.name} — {booking.user?.name}</p>
                          <p className="text-sm text-gray-500">
                            {booking.caregiver?.name} · {new Date(booking.bookingDate).toLocaleDateString()} · ${booking.totalAmount}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                          >
                            {['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Management */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Manage Users ({users.length})</h2>
                <div className="card overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Phone</th>
                        <th className="pb-3">Joined</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-gray-50">
                          <td className="py-3 font-medium">{u.name}</td>
                          <td className="py-3">{u.email}</td>
                          <td className="py-3">{u.phone || '—'}</td>
                          <td className="py-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td className="py-3">
                            <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Caregivers Management */}
            {activeTab === 'caregivers' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Manage Caregivers ({caregivers.length})</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {caregivers.map((c) => (
                    <div key={c._id} className="card">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold">{c.name}</p>
                          <p className="text-sm text-primary-600">{c.specialization}</p>
                          <p className="text-xs text-gray-500 mt-1">{c.experience} yrs · ★ {c.rating} · ${c.hourlyRate}/hr</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block capitalize ${
                            c.availability === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {c.availability}
                          </span>
                        </div>
                        <button onClick={() => handleDeleteCaregiver(c._id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
