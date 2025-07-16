import React, { useState, useEffect } from 'react';
import { getAllSessions } from '../api/session';
import toast from 'react-hot-toast';
import moment from 'moment';

const Sessions = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getAllSessions();
        setSessions(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch sessions.');
      }
    };
    fetchSessions();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Our Sessions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.map((session) => (
          <div key={session.id} className="border rounded-lg p-4">
            <h3 className="text-xl font-bold">{session.name}</h3>
            <p className="text-gray-700 mb-2">{session.description}</p>
            <p className="text-lg font-semibold">
              {moment(session.startTime).format('MMMM Do YYYY, h:mm a')}
            </p>
            <p>Duration: {session.duration} minutes</p>
            <p>Instructor: {session.instructor}</p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded mt-4">
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sessions;