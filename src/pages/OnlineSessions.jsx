import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, User, Video, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const OnlineSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view sessions');
      return;
    }
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    try {
      const response = await sessionsAPI.getAll();
      const apiResp = response.data;
      if (apiResp.success) {
        setSessions(apiResp.data || []);
      } else {
        throw new Error(apiResp.message || 'Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  const sessionsArray = Array.isArray(sessions) ? sessions : [];

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="section-subtitle">Online Training</p>
          <h1 className="section-title">Virtual Fitness Sessions</h1>
          <p className="section-text">
            Join our expert trainers for live online sessions from the comfort of your home.
            Get personalized attention and achieve your fitness goals with our virtual training programs.
          </p>
        </div>

        {/* Sessions Grid */}
        {sessionsArray.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Video size={64} style={{ color: 'var(--coquelicot)', marginBottom: '20px' }} />
            <h3 style={{ color: 'var(--rich-black-fogra-29-1)', marginBottom: '10px' }}>No Sessions Available</h3>
            <p style={{ color: 'var(--sonic-silver)' }}>
              Check back later for upcoming online training sessions.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {sessionsArray.map((session) => (
              <div key={session.id} className="session-card fade-in">
                <div className="card-banner">
                  <img
                    src={session.imageUrl || 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={session.title}
                    className="img-cover"
                  />
                  <div className="card-meta">
                    <Calendar size={16} />
                    {new Date(session.scheduledDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="session-info">
                  <h3 className="session-title">{session.title}</h3>
                  <p className="session-instructor">
                    <User size={16} />
                    Instructor: {session.instructorName}
                  </p>
                  <p className="card-text">{session.description}</p>

                  <div className="session-details">
                    <div className="session-detail">
                      <Clock size={16} />
                      {session.duration} minutes
                    </div>
                    <div className="session-detail">
                      <Users size={16} />
                      {session.maxParticipants} max participants
                    </div>
                    <div className="session-detail">
                      <Video size={16} />
                      Live Session
                    </div>
                  </div>

                  <div className="session-price">₹{session.price}</div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    {user ? (
                      <Link
                        to={`/book-session/${session.id}`}
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                      >
                        Book Session
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="btn btn-primary"
                        style={{ flex: 1 }}
                      >
                        Login to Book
                      </Link>
                    )}
                    <button className="btn btn-outline">Learn More</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Benefits Section */}
        <div style={{ marginTop: '80px', textAlign: 'center' }}>
          <h2 className="section-title">Why Choose Our Online Sessions?</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            marginTop: '40px'
          }}>
            <div className="class-card fade-in">
              <div style={{ padding: '30px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏠</div>
                <h3 className="card-title">Train from Home</h3>
                <p className="card-text">
                  No need to travel. Join from the comfort of your home with just an internet connection.
                </p>
              </div>
            </div>

            <div className="class-card fade-in">
              <div style={{ padding: '30px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👨‍🏫</div>
                <h3 className="card-title">Expert Guidance</h3>
                <p className="card-text">
                  Get personalized attention from certified trainers who guide you through every workout.
                </p>
              </div>
            </div>

            <div className="class-card fade-in">
              <div style={{ padding: '30px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏰</div>
                <h3 className="card-title">Flexible Timing</h3>
                <p className="card-text">
                  Choose from multiple time slots that fit your schedule and lifestyle.
                </p>
              </div>
            </div>

            <div className="class-card fade-in">
              <div style={{ padding: '30px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💰</div>
                <h3 className="card-title">Affordable Pricing</h3>
                <p className="card-text">
                  High-quality training at affordable prices. Pay per session or choose monthly packages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineSessions;