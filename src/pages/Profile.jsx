import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';
import { User, Calendar, Clock, Video, MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await bookingsAPI.getUserBookings();
      const apiResp = response.data;
      setBookings(apiResp.data || []);
    } catch (error) {
      toast.error('Failed to fetch bookings');
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

  const bookingsArray = Array.isArray(bookings) ? bookings : [];

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 15px' }}>
        {/* Profile Header */}
        <div className="class-card fade-in" style={{ marginBottom: '30px' }}>
          <div className="card-content" style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              background: 'var(--coquelicot)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '3rem',
              color: 'var(--white)'
            }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h2 style={{ color: 'var(--rich-black-fogra-29-1)', marginBottom: '10px' }}>
              {user?.name}
            </h2>
            <p style={{ color: 'var(--sonic-silver)', marginBottom: '20px' }}>
              Member since {new Date(user?.createdAt).toLocaleDateString() || 'Recently'}
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '30px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} />
                <span>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} />
                <span>{user?.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          marginBottom: '30px',
          borderBottom: '2px solid var(--gainsboro)'
        }}>
          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              padding: '15px 25px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'bookings' ? '3px solid var(--coquelicot)' : '3px solid transparent',
              color: activeTab === 'bookings' ? 'var(--coquelicot)' : 'var(--sonic-silver)',
              fontWeight: 'var(--fw-500)',
              cursor: 'pointer',
              transition: 'var(--transition-1)'
            }}
          >
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '15px 25px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'profile' ? '3px solid var(--coquelicot)' : '3px solid transparent',
              color: activeTab === 'profile' ? 'var(--coquelicot)' : 'var(--sonic-silver)',
              fontWeight: 'var(--fw-500)',
              cursor: 'pointer',
              transition: 'var(--transition-1)'
            }}
          >
            Profile Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'bookings' && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '20px', color: 'var(--rich-black-fogra-29-1)' }}>
              My Session Bookings
            </h3>
            
            {bookingsArray.length === 0 ? (
              <div className="class-card">
                <div className="card-content" style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <Video size={64} style={{ color: 'var(--coquelicot)', marginBottom: '20px' }} />
                  <h4 style={{ color: 'var(--rich-black-fogra-29-1)', marginBottom: '10px' }}>
                    No Bookings Yet
                  </h4>
                  <p style={{ color: 'var(--sonic-silver)', marginBottom: '20px' }}>
                    You haven't booked any online sessions yet. Start your fitness journey today!
                  </p>
                  <a href="/online-sessions" className="btn btn-primary">
                    Browse Sessions
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '20px' }}>
                {bookingsArray.map((booking) => (
                  <div key={booking.id} className="class-card">
                    <div className="card-content">
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'auto 1fr auto', 
                        gap: '20px',
                        alignItems: 'center'
                      }}>
                        <div style={{ 
                          width: '80px', 
                          height: '80px',
                          borderRadius: 'var(--radius-8)',
                          overflow: 'hidden'
                        }}>
                          <img
                            src={booking.session?.imageUrl || 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=200'}
                            alt={booking.session?.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        <div>
                          <h4 style={{ color: 'var(--rich-black-fogra-29-1)', marginBottom: '8px' }}>
                            {booking.session?.title}
                          </h4>
                          <p style={{ color: 'var(--sonic-silver)', marginBottom: '10px' }}>
                            Instructor: {booking.session?.instructorName}
                          </p>
                          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Calendar size={14} />
                              <span style={{ fontSize: '1.3rem' }}>
                                {new Date(booking.session?.scheduledDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              <Clock size={14} />
                              <span style={{ fontSize: '1.3rem' }}>
                                {booking.session?.duration} min
                              </span>
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ 
                            background: booking.status === 'CONFIRMED' ? 'var(--coquelicot_10)' : 
                                      booking.status === 'COMPLETED' ? '#e8f5e8' : '#fff3cd',
                            color: booking.status === 'CONFIRMED' ? 'var(--coquelicot)' : 
                                   booking.status === 'COMPLETED' ? '#155724' : '#856404',
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-5)',
                            fontSize: '1.2rem',
                            fontWeight: 'var(--fw-500)',
                            marginBottom: '10px'
                          }}>
                            {booking.status}
                          </div>
                          {booking.status === 'CONFIRMED' && booking.meetLink && (
                            <a 
                              href={booking.meetLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-primary"
                              style={{ fontSize: '1.2rem', padding: '8px 16px' }}
                            >
                              <Video size={14} />
                              Join Session
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="fade-in">
            <div className="class-card">
              <div className="card-content">
                <h3 style={{ marginBottom: '20px', color: 'var(--rich-black-fogra-29-1)' }}>
                  Profile Settings
                </h3>
                
                <form>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={user?.name}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        defaultValue={user?.email}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        defaultValue={user?.phone}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        defaultValue={user?.dateOfBirth}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      defaultValue={user?.address}
                      placeholder="Enter your complete address"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fitness Goals</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      defaultValue={user?.fitnessGoals}
                      placeholder="Tell us about your fitness goals and preferences"
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;