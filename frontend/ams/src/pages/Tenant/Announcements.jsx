import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api'; // Adjust path if needed
import { DataContext } from '../../context/UserContext';
import ToastCont from '../toastCont';
import { toast } from 'react-toastify';   
const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const { user } = useContext(DataContext);
  const isAdmin = user?.role === 'admin';

  // Fetch announcements from the server
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data.announcements);
    } catch (error) {
      toast.error(`${error.resonse.data.message}`);
      console.error('Error fetching announcements:', error);
      setError('Error fetching announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

   
    const interval = setInterval(() => {
      fetchAnnouncements();
    }, 5000); 
    return () => clearInterval(interval); 
  }, []);

  const handleInputChange = (e) => {
    setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      toast.error('Both title and content are required.');
      return; // Prevent submission if validation fails
    }

    try {
      const res = await api.post('/announcements', newAnnouncement);
      setAnnouncements([...announcements, res.data]);
      setShowModal(false);
      setNewAnnouncement({ title: '', content: '' });
      setError(null); // Clear any previous errors
      toast.success("Announcement announced successfully");
    } catch (error) {
      console.error('Error submitting announcement:', error);
      toast.error(`${error.resonse.data.message}`);
      setError('Error submitting announcement');
    }
  };

  if (loading) {
    return <div style={{ color: 'white' }}>Loading announcements...</div>;
  }

  if (error) {
    return <div style={{ color: 'white' }}>{error}</div>;
  }

  return (
    <div
      className="announcements-list"
      style={{
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundImage: `url("images/minimalist-black-interior-with-black-sofa.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div style={{ height: "6.2rem", position: "relative" }}></div>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Announcements</h2>
      {isAdmin && (
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#008CBA',
            color: 'white',
            borderRadius: '15px',
            cursor: 'pointer',
            marginBottom: '20px',
            marginRight: '10%',
            alignSelf: 'flex-end',
          }}
        >
          Create New Announcement
        </button>
      )}

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#333',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            zIndex: '1000',
            width: '400px',
            textAlign: 'center',
          }}
        >
          <h3>New Announcement</h3>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newAnnouncement.title}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px' }}
          />
          <textarea
            name="content"
            placeholder="Content"
            value={newAnnouncement.content}
            onChange={handleInputChange}
            rows="4"
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', marginBottom: '10px' }}
          ></textarea>
          <div style={{ marginBottom: '10px' }}>
            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error if validation fails */}
          </div>
          <button
            onClick={() => handleSubmit()}
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              marginRight: '10px',
            }}
          >
            Submit
          </button>
          <button
            onClick={() => setShowModal(false)}
            style={{ backgroundColor: 'red', color: 'white', padding: '8px 12px', borderRadius: '4px' }}
          >
            Cancel
          </button>
        </div>
      )}

      <table
        style={{
          width: '85%',
          borderCollapse: 'collapse',
          textAlign: 'center',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'rgba(51, 51, 51, 0.6)',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <thead>
          <tr>
            <th style={{ border: '1px solid #555', padding: '16px', backgroundColor: 'rgba(68, 68, 68, 0.7)', color: '#ddd', fontSize: '18px' }}>Date</th>
            <th style={{ border: '1px solid #555', padding: '16px', backgroundColor: 'rgba(68, 68, 68, 0.7)', color: '#ddd', fontSize: '18px' }}>Title</th>
            <th style={{ border: '1px solid #555', padding: '16px', backgroundColor: 'rgba(68, 68, 68, 0.7)', color: '#ddd', fontSize: '18px' }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((announcement) => (
            <tr key={announcement._id} style={{ backgroundColor: 'rgba(59, 59, 59, 0.7)' }}>
              <td style={{ border: '1px solid #555', padding: '14px', textAlign: 'center', fontSize: '16px' }}>
                {new Date(announcement.date).toLocaleDateString()}
              </td>
              <td style={{ border: '1px solid #555', padding: '14px', textAlign: 'center', fontSize: '16px' }}>
                {announcement.title}
              </td>
              <td style={{ border: '1px solid #555', padding: '14px', textAlign: 'center', fontSize: '16px' }}>
                {announcement.content}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <ToastCont/>
      </div>
    </div>
  );
};

export default AnnouncementsList;
