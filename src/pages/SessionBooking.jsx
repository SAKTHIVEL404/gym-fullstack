
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { sessionsAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, CreditCard, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const SessionBooking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    notes: '',
    paymentMethod: 'CARD',
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    try {
      const response = await sessionsAPI.getById(id);
      setSession(response.data);
    } catch (error) {
      toast.error('Failed to fetch session details');
      navigate('/online-sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!bookingData.paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    setBookingLoading(true);
    try {
      const orderResponse = await paymentAPI.createOrder({
        sessionId: session.id,
        amount: session.price,
        currency: 'INR',
      });
      const paymentResult = {
        success: true,
        paymentId: 'pay_' + Date.now(),
        orderId: orderResponse.data.orderId,
      };
      if (paymentResult.success) {
        const bookingResponse = await sessionsAPI.book(session.id, {
          ...bookingData,
          paymentId: paymentResult.paymentId,
          orderId: paymentResult.orderId,
        });
        toast.success('Session booked successfully!');
        navigate('/profile');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to book session. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleImageNavigation = (direction) => {
    const images = session?.images || [session?.imageUrl || 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600'];
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-coquelicot"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="pt-[100px] text-center py-16 font-rubik text-[1.4rem] text-sonic-silver">
        <h2 className="font-catamaran text-[2.5rem] font-bold text-rich-black-fogra-29-1 mb-4">Session not found</h2>
        <Link
          to="/online-sessions"
          className="bg-coquelicot text-white px-6 py-3 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
        >
          Back to Sessions
        </Link>
      </div>
    );
  }

  const images = session.images || [session.imageUrl || 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600'];

  return (
    <div className="pt-[100px] min-h-screen bg-white font-rubik text-[1.4rem] text-sonic-silver">
      <div className="max-w-[1140px] mx-auto px-4">
        <div className="mb-6">
          <Link
            to="/online-sessions"
            className="flex items-center gap-2 text-[1.4rem] text-coquelicot hover:underline transition-colors duration-300"
          >
            <ArrowLeft size={18} />
            Back to Sessions
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="font-catamaran text-[2.5rem] md:text-[4rem] font-extrabold text-rich-black-fogra-29-1 mb-3">
            Book Your Session
          </h1>
          <p className="text-[1.4rem] text-sonic-silver max-w-[700px] mx-auto">
            Complete your booking for this online fitness session with Phoenix Fitness Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Details */}
          <div className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] animate-slide-in-left">
            <div className="relative">
              <img
                src={images[currentImageIndex]}
                alt={session.title}
                className="w-full h-[300px] object-cover rounded-t-[10px]"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-coquelicot-10 transition-colors duration-300"
                  >
                    <ChevronLeft size={20} className="text-coquelicot" />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-coquelicot-10 transition-colors duration-300"
                  >
                    <ChevronRight size={20} className="text-coquelicot" />
                  </button>
                </>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-catamaran text-[2rem] font-bold text-rich-black-fogra-29-1 mb-3">{session.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <User size={16} className="text-coquelicot" />
                <span className="text-[1.3rem]">Instructor: {session.instructorName}</span>
              </div>
              <p className="text-[1.3rem] text-sonic-silver leading-[1.8] mb-4">{session.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-coquelicot" />
                  <span className="text-[1.3rem]">{new Date(session.scheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-coquelicot" />
                  <span className="text-[1.3rem]">{session.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-coquelicot" />
                  <span className="text-[1.3rem]">Online Session via Google Meet</span>
                </div>
              </div>
              <div className="font-catamaran text-[1.8rem] font-extrabold text-coquelicot">₹{session.price}</div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:sticky lg:top-[100px] bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] animate-slide-in-right">
            <div className="p-6">
              <h3 className="font-catamaran text-[2rem] font-bold text-rich-black-fogra-29-1 mb-4">Booking Details</h3>
              <form onSubmit={handleBooking}>
                <div className="mb-4">
                  <label className="font-catamaran text-[1.4rem] font-medium text-rich-black-fogra-29-1 mb-2 block">Participant Name</label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full px-4 py-2 border border-light-gray rounded-[6px] text-[1.3rem] bg-gainsboro"
                  />
                </div>
                <div className="mb-4">
                  <label className="font-catamaran text-[1.4rem] font-medium text-rich-black-fogra-29-1 mb-2 block">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2 border border-light-gray rounded-[6px] text-[1.3rem] bg-gainsboro"
                  />
                </div>
                <div className="mb-4">
                  <label className="font-catamaran text-[1.4rem] font-medium text-rich-black-fogra-29-1 mb-2 block">Special Notes (Optional)</label>
                  <textarea
                    rows="4"
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                    placeholder="Any special requirements or notes for the instructor..."
                    className="w-full px-4 py-2 border border-light-gray rounded-[6px] text-[1.3rem] focus:outline-none focus:border-coquelicot transition-colors duration-300"
                  />
                </div>
                <div className="mb-6">
                  <label className="font-catamaran text-[1.4rem] font-medium text-rich-black-fogra-29-1 mb-2 block">Payment Method</label>
                  <select
                    value={bookingData.paymentMethod}
                    onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 border border-light-gray rounded-[6px] text-[1.3rem] focus:outline-none focus:border-coquelicot transition-colors duration-300"
                  >
                    <option value="CARD">Credit/Debit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="NETBANKING">Net Banking</option>
                    <option value="WALLET">Digital Wallet</option>
                  </select>
                </div>
                <div className="bg-gainsboro p-4 rounded-[8px] mb-6">
                  <h4 className="font-catamaran text-[1.6rem] font-bold text-rich-black-fogra-29-1 mb-3">Payment Summary</h4>
                  <div className="flex justify-between mb-2 text-[1.3rem]">
                    <span>Session Price</span>
                    <span>₹{session.price}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-[1.3rem]">
                    <span>Platform Fee</span>
                    <span>₹0</span>
                  </div>
                  <hr className="my-3 border-light-gray" />
                  <div className="flex justify-between text-[1.4rem] font-extrabold text-coquelicot">
                    <span>Total Amount</span>
                    <span>₹{session.price}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-[8px] text-[1.4rem] font-rubik transition-all duration-300 ${
                    bookingLoading
                      ? 'bg-coquelicot-20 text-sonic-silver cursor-not-allowed'
                      : 'bg-coquelicot text-white hover:bg-rich-black-fogra-29-1'
                  }`}
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Pay & Book Session
                    </>
                  )}
                </button>
                <p className="text-[1.2rem] text-sonic-silver text-center mt-4">
                  By booking, you agree to our terms and conditions. You’ll receive a Google Meet link 30 minutes before the session.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionBooking;
