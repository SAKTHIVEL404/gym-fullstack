import { useState, useEffect } from 'react';
import { bookingsAPI } from '../../services/api';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll();
      const apiResp = response.data;
      setBookings(apiResp.data || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingsAPI.updateStatus(bookingId, status);
      toast.success('Booking status updated successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return { bg: 'bg-coquelicot-10', text: 'text-coquelicot' };
      case 'COMPLETED':
        return { bg: 'bg-[#e8f5e8]', text: 'text-[#155724]' };
      case 'CANCELLED':
        return { bg: 'bg-[#f8d7da]', text: 'text-[#721c24]' };
      case 'PENDING':
        return { bg: 'bg-[#fff3cd]', text: 'text-[#856404]' };
      default:
        return { bg: 'bg-gainsboro', text: 'text-sonic-silver' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle size={16} />;
      case 'COMPLETED':
        return <CheckCircle size={16} />;
      case 'CANCELLED':
        return <XCircle size={16} />;
      case 'PENDING':
        return <AlertCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const bookingsArray = Array.isArray(bookings) ? bookings : [];

  const filteredBookings = statusFilter
    ? bookingsArray.filter(booking => booking.status === statusFilter)
    : bookingsArray;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-coquelicot"></div>
      </div>
    );
  }

  return (
    <section className="py-[80px] px-4 bg-white font-rubik text-[1.6rem] text-sonic-silver leading-[1.6]">
      <div className="max-w-[1140px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-[30px]">
          <h2 className="font-catamaran text-[2.5rem] md:text-[4.5rem] font-extrabold text-rich-black-fogra-29-1 leading-[1.2]">
            Bookings Management
          </h2>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gainsboro border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver max-w-[200px] focus:outline-none focus:border-coquelicot"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-[30px]">
          {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => {
            const count = bookingsArray.filter(b => b.status === status).length;
            const statusStyle = getStatusColor(status);

            return (
              <div
                key={status}
                className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6 text-center bg-gainsboro rounded-b-[10px]">
                  <div className={`${statusStyle.bg} ${statusStyle.text} p-3 rounded-full w-[60px] h-[60px] flex items-center justify-center mx-auto mb-4`}>
                    {getStatusIcon(status)}
                  </div>
                  <h3 className="font-catamaran text-[2rem] font-bold text-rich-black-fogra-29-1 mb-2">
                    {count}
                  </h3>
                  <p className="font-rubik text-[1.3rem] text-sonic-silver capitalize">
                    {status.toLowerCase()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] transition-all duration-300">
          <div className="p-6 bg-gainsboro rounded-b-[10px]">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-[40px]">
                <p className="font-rubik text-[1.5rem] text-sonic-silver">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[1.4rem] border-collapse">
                  <thead>
                    <tr className="border-b-2 border-light-gray">
                      <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">User</th>
                      <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">Session</th>
                      <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">Date & Time</th>
                      <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">Amount</th>
                      <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">Status</th>
                      <th className="p-4 text-left font-catamaran font-bold text-rich-black-fogra-29-1">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => {
                      const statusStyle = getStatusColor(booking.status);

                      return (
                        <tr key={booking.id} className="border-b border-light-gray hover:bg-coquelicot-10">
                          <td className="p-4">
                            <div>
                              <div className="font-catamaran font-medium text-rich-black-fogra-29-1">
                                {booking.user?.name}
                              </div>
                              <div className="font-rubik text-[1.2rem] text-sonic-silver">
                                {booking.user?.email}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-catamaran font-medium text-rich-black-fogra-29-1">
                                {booking.session?.title}
                              </div>
                              <div className="font-rubik text-[1.2rem] text-sonic-silver">
                                {booking.session?.instructorName}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar size={14} className="text-coquelicot" />
                              <span>{new Date(booking.session?.scheduledDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-coquelicot" />
                              <span>{new Date(booking.session?.scheduledDate).toLocaleTimeString()}</span>
                            </div>
                          </td>
                          <td className="p-4 font-catamaran font-medium text-coquelicot">
                            ₹{booking.amount}
                          </td>
                          <td className="p-4">
                            <div className={`${statusStyle.bg} ${statusStyle.text} px-3 py-1 rounded-[5px] font-rubik text-[1.2rem] font-medium flex items-center gap-2`}>
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              {booking.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                                    className="bg-coquelicot text-white px-3 py-1 rounded-[5px] font-rubik text-[1.2rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                                    className="bg-[#dc3545] text-white px-3 py-1 rounded-[5px] font-rubik text-[1.2rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {booking.status === 'CONFIRMED' && (
                                <button
                                  onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                                  className="bg-[#28a745] text-white px-3 py-1 rounded-[5px] font-rubik text-[1.2rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                                >
                                  Mark Complete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminBookings;