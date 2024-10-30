import React, { useState, useEffect } from 'react';
import api from '../../utils/api'; // Adjust path if needed

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', status: 'active' });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/announcements');
        setAnnouncements(res.data.announcements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
        setError('Error fetching announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleInputChange = (e) => {
    setNewAnnouncement({ ...newAnnouncement, [e.target.name]: e.target.value });
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
        padding: '20px'
      }}
    >
      <div style={{ height: "6.2rem", position: "relative" }}></div>
      <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '1.5rem' }}>Announcements</h2>

      <button
  onClick={() => setShowModal(true)}
  style={{
    padding: '10px 20px',
    backgroundColor: '#008CBA',
    color: 'white',
    borderRadius: '15px',
    cursor: 'pointer',
    marginBottom: '20px',
    marginRight: '10%', // Shift button a bit to the right
    alignSelf: 'flex-end', // Aligns the button to the right
  }}
>
  Create New Announcement
</button>

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
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px' }}
          />
          <textarea
            name="content"
            placeholder="Content"
            value={newAnnouncement.content}
            onChange={handleInputChange}
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', marginBottom: '10px' }}
          ></textarea>
          <div style={{ marginBottom: '10px' }}>
            {/* <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
              <input
                type="radio"
                name="status"
                value="active"
                checked={newAnnouncement.status === 'active'}
                onChange={handleInputChange}
                style={{ transform: 'scale(1.3)', accentColor: '#ffffff' }}
              />
              Active
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={newAnnouncement.status === 'inactive'}
                onChange={handleInputChange}
                style={{ transform: 'scale(1.3)', accentColor: '#ffffff' }}
              />
              Inactive
            </label> */}
          </div>
          <button
            onClick={() => setShowModal(false)}
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
            <th style={{ border: '1px solid #555', padding: '16px', backgroundColor: 'rgba(68, 68, 68, 0.7)', color: '#ddd', fontSize: '18px' }}>Status</th>
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
              <td style={{ border: '1px solid #555', padding: '14px', textAlign: 'center', fontSize: '16px', color: announcement.status === 'active' ? 'green' : 'red', fontWeight: 'bold' }}>
                {announcement.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnnouncementsList;
