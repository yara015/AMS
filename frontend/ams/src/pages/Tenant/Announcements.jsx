import React, { useState, useEffect } from 'react';
import api from '../../utils/api'; // Adjust path if needed

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch announcements from the backend API
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get(`/announcements`);
        setAnnouncements(res.data.announcements);
      } catch (error) {
        console.error('Error fetching mail notifications:', error);
        setError('Error fetching announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <div style={{ color: 'white' }}>Loading announcements...</div>;
  }

  if (error) {
    return <div style={{ color: 'white' }}>{error}</div>;
  }

  return (
    <div className="announcements-list" style={{ color: 'white' }}>
      <h2>Announcements</h2>
      <ul>
        {announcements.map((announcement) => (
          <li key={announcement._id} className={`announcement-item ${announcement.status}`}>
            <h3>{announcement.title}</h3>
            <p>{announcement.content}</p>
            <small>Date: {new Date(announcement.date).toLocaleDateString()}</small>
            <p>Status: <strong>{announcement.status}</strong></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnouncementsList;
