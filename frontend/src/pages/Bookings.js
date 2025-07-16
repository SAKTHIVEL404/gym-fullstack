import React, { useState, useEffect } from 'react';
import { getUserBookings } from '../api/booking';
import toast from 'react-hot-toast';
import moment from 'moment';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getUserBookings();
        setBookings(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch your bookings.');
      }
    };
    fetchBookings();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="border rounded-lg p-4">
            <h3 className="text-xl font-bold">{booking.session.name}</h3>
            <p className="text-gray-700">
              {moment(booking.session.startTime).format('MMMM Do YYYY, h:mm a')}
            </p>
            <p>Status: <span className={`font-semibold ${booking.status === 'CONFIRMED' ? 'text-green-500' : 'text-yellow-500'}`}>{booking.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;