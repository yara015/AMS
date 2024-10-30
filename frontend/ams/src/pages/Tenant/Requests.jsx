import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { DataContext } from '../../context/UserContext';

const RequestsComplaints = () => {
  const [requestsComplaints, setRequestsComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({ type: '', description: '' });
  // const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchRequestsComplaints = async () => {
      try {
        const endpoint = isAdmin ? '/requests/admin' : '/requests/tenant';
        const res = await api.get(endpoint);
        setRequestsComplaints(res.data.requests);
      } catch (error) {
        setError('Error fetching requests and complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchRequestsComplaints();
  }, [isAdmin]);

  const handleInputChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleSubmitRequest = async () => {
    // setSubmitting(true);
    try {
      const res = await api.post('/requests', newRequest);
      setRequestsComplaints([...requestsComplaints, res.data]);
      setShowModal(false);
      setNewRequest({ type: '', description: '' });
    } catch (error) {
      setError('Error submitting request');
    } 
  };

  return (
    <div
      className="requests-complaints-list"
      style={{
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundImage: `url("images/Announcementspage.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      <div style={{ height: "6rem" }}></div>
      <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '1.5rem' }}>Requests and Complaints</h2>

      {/* Radio-style button to open modal */}
      <div style={{ alignSelf: 'flex-end', marginBottom: '10px', cursor: 'pointer' }}>
        <label
          onClick={() => setShowModal(true)}
          style={{
            display: 'inline-block',
            padding: '10px 20px',
            backgroundColor: '#008CBA',
            color: 'white',
            borderRadius: '15px',
            cursor: 'pointer',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <input
            type="radio"
            name="makeNewRequest"
            checked={showModal}
            onChange={() => setShowModal(true)}
            style={{ marginRight: '8px', cursor: 'pointer' }}
          />
          Make a New Request?
        </label>
      </div>

      {/* Modal */}
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
          <h3>New Request</h3>
          <input
            type="text"
            name="type"
            placeholder="Type (e.g., Maintenance)"
            value={newRequest.type}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px' }}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newRequest.description}
            onChange={handleInputChange}
            rows="4"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', marginBottom: '10px' }}
          ></textarea>
          <button 
            onClick={handleSubmitRequest} 
            // disabled={submitting}
            style={{ 
              backgroundColor: 'green', 
              color: 'white', 
              padding: '8px 12px', 
              borderRadius: '4px', 
              // cursor: submitting ? 'not-allowed' : 'pointer', 
              marginRight: '10px' 
            }}
          >
            {/* {submitting ? 'Submitting...' : 'Submit'} */}
            Submit
          </button>
          <button onClick={() => setShowModal(false)} style={{ backgroundColor: 'red', color: 'white', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      )}

      <table style={{
          width: '85%',
          borderCollapse: 'collapse',
          textAlign: 'center',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: 'rgba(51, 51, 51, 0.6)',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}>
        <thead>
          <tr>
            <th style={{ padding: '16px', backgroundColor: 'rgba(68, 68, 68, 0.7)', color: '#ddd' }}>Date</th>
            <th style={{ padding: '16px', backgroundColor: 'rgba(68, 68, 68, 0.7)', color: '#ddd' }}>Title</th>
            <th style={{ padding: '16px', backgroundColor: 'rgba(68, 68, 68, 0.7)', color: '#ddd' }}>Description</th>
            <th style={{ padding: '16px', backgroundColor: 'rgba(68, 68, 68, 0.7)', color: '#ddd' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {requestsComplaints.map((requestComplaint) => (
            <tr key={requestComplaint._id} style={{ backgroundColor: 'rgba(59, 59, 59, 0.7)' }}>
              <td style={{ padding: '14px', textAlign: 'center', fontSize: '16px' }}>
                {new Date(requestComplaint.createdAt).toLocaleDateString()}
              </td>
              <td style={{ padding: '14px', textAlign: 'center', fontSize: '16px' }}>
                {requestComplaint.type}
              </td>
              <td style={{ padding: '14px', textAlign: 'center', fontSize: '16px' }}>
                {requestComplaint.description}
              </td>
              <td style={{ padding: '14px', textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                {requestComplaint.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsComplaints;
