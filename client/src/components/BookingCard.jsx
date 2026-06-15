const BookingCard = ({ booking, onCancel, showActions = true }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    'in-progress': 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold text-gray-900">{booking.service?.name}</h3>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize ${statusColors[booking.status]}`}>
              {booking.status}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-600">
            <p>👤 {booking.caregiver?.name}</p>
            <p>📅 {formatDate(booking.bookingDate)} at {booking.bookingTime}</p>
            <p>⏱️ {booking.duration} hour(s)</p>
            <p className="font-semibold text-primary-600">💰 ${booking.totalAmount}</p>
          </div>
          {booking.address && (
            <p className="text-xs text-gray-400 mt-2">
              📍 {booking.address.street}, {booking.address.city}
            </p>
          )}
        </div>

        {showActions && !['completed', 'cancelled'].includes(booking.status) && onCancel && (
          <button
            onClick={() => onCancel(booking._id)}
            className="text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors self-start"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
