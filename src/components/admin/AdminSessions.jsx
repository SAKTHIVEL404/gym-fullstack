import { useState, useEffect } from 'react';
import { sessionsAPI } from '../../services/api';
import { Plus, Edit, Trash2, Calendar, Clock, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructorName: '',
    scheduledDate: '',
    duration: '',
    maxParticipants: '',
    price: '',
    imageUrl: '',
    meetLink: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await sessionsAPI.getAll();
      const apiResp = response.data;
      setSessions(apiResp.data || []);
    } catch (error) {
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build payload converting strings to correct types
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      instructorName: formData.instructorName.trim(),
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString().slice(0,19) : null,
      duration: formData.duration ? parseInt(formData.duration, 10) : null,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants, 10) : null,
      price: formData.price ? parseFloat(formData.price) : null,
      imageUrl: formData.imageUrl.trim() || null,
      meetLink: formData.meetLink.trim() || null,
    };

    if (!payload.title || !payload.instructorName || !payload.scheduledDate || !payload.duration || !payload.maxParticipants || !payload.price) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editingSession) {
        await sessionsAPI.update(editingSession.id, payload);
        toast.success('Session updated successfully');
      } else {
        await sessionsAPI.create(payload);
        toast.success('Session created successfully');
      }

      setShowModal(false);
      setEditingSession(null);
      setFormData({
        title: '',
        description: '',
        instructorName: '',
        scheduledDate: '',
        duration: '',
        maxParticipants: '',
        price: '',
        imageUrl: '',
        meetLink: ''
      });
      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save session');
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      description: session.description,
      instructorName: session.instructorName,
      scheduledDate: new Date(session.scheduledDate).toISOString().slice(0, 16),
      duration: session.duration,
      maxParticipants: session.maxParticipants,
      price: session.price,
      imageUrl: session.imageUrl || '',
      meetLink: session.meetLink || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await sessionsAPI.delete(id);
        toast.success('Session deleted successfully');
        fetchSessions();
      } catch (error) {
        toast.error('Failed to delete session');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            Sessions Management
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-coquelicot text-white px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] flex items-center gap-2 hover:bg-rich-black-fogra-29-1 transition-all duration-300"
          >
            <Plus size={18} />
            Add Session
          </button>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(Array.isArray(sessions) ? sessions : []).map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-[10px] border border-coquelicot-20 shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_hsla(12,98%,52%,0.2)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={session.imageUrl || 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600'}
                  alt={session.title}
                  className="w-full h-[200px] object-cover rounded-t-[10px]"
                />
              </div>
              <div className="p-6 bg-gainsboro rounded-b-[10px]">
                <h3 className="font-catamaran text-[2rem] font-bold text-rich-black-fogra-29-1 mb-2">
                  {session.title}
                </h3>
                <p className="font-rubik text-[1.3rem] text-sonic-silver mb-4">
                  Instructor: {session.instructorName}
                </p>
                <p className="font-rubik text-[1.4rem] text-sonic-silver mb-4 line-clamp-3">
                  {session.description}
                </p>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-coquelicot" />
                    <span className="font-rubik text-[1.3rem]">
                      {new Date(session.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-coquelicot" />
                    <span className="font-rubik text-[1.3rem]">
                      {session.duration} min
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-coquelicot" />
                    <span className="font-rubik text-[1.3rem]">
                      {session.maxParticipants} max
                    </span>
                  </div>
                </div>
                <div className="font-catamaran text-[1.8rem] font-medium text-coquelicot mb-4">
                  ₹{session.price}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(session)}
                    className="flex-1 bg-white border border-coquelicot text-coquelicot px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-coquelicot hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="flex-1 bg-[#dc3545] text-white px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]">
            <div className="bg-white p-8 rounded-[10px] w-[90%] max-w-[600px] max-h-[90vh] overflow-y-auto border border-coquelicot-20">
              <h3 className="font-catamaran text-[2rem] font-bold text-rich-black-fogra-29-1 mb-6">
                {editingSession ? 'Edit Session' : 'Add New Session'}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Session Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Instructor Name</label>
                    <input
                      type="text"
                      name="instructorName"
                      value={formData.instructorName}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      required
                      min="15"
                      max="180"
                    />
                  </div>

                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Max Participants</label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      required
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Image URL</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="block font-catamaran font-medium text-rich-black-fogra-29-1 mb-2">Google Meet Link</label>
                    <input
                      type="url"
                      name="meetLink"
                      value={formData.meetLink}
                      onChange={handleChange}
                      className="w-full bg-white border border-coquelicot-20 rounded-[8px] px-4 py-2 font-rubik text-[1.4rem] text-sonic-silver focus:outline-none focus:border-coquelicot"
                      placeholder="https://meet.google.com/xxx-xxx-xxx"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 bg-coquelicot text-white px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-rich-black-fogra-29-1 transition-all duration-300"
                  >
                    {editingSession ? 'Update Session' : 'Create Session'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingSession(null);
                      setFormData({
                        title: '',
                        description: '',
                        instructorName: '',
                        scheduledDate: '',
                        duration: '',
                        maxParticipants: '',
                        price: '',
                        imageUrl: '',
                        meetLink: ''
                      });
                    }}
                    className="flex-1 bg-white border border-coquelicot text-coquelicot px-4 py-2 rounded-[8px] font-rubik text-[1.4rem] hover:bg-coquelicot hover:text-white transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminSessions;