import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { DataContext } from '../../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const RequestsComplaints = () => {
  const [requestsComplaints, setRequestsComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(DataContext);
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({ type: '', description: '' });

  const isAdmin = user?.role === 'admin';

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
  useEffect(() => {
    fetchRequestsComplaints();
  }, [isAdmin]);

  const handleInputChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleSubmitRequest = async () => {
    try {
      const res = await api.post('/requests/', newRequest);
      setRequestsComplaints([...requestsComplaints, res.data]);
      setShowModal(false);
      setNewRequest({ type: '', description: '' });
      fetchRequestsComplaints();
    } catch (error) {
      setError('Error submitting request');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setRequestsComplaints(prevRequests =>
      prevRequests.map(request =>
        request._id === id ? { ...request, status: newStatus } : request
      )
    );
  };

  const handleUpdate = async (id, status) => {
    try {
      await api.put(`/requests/${id}`, { status });
      console.log(`Status for request ${id} updated successfully.`);
      fetchRequestsComplaints();
    } catch (error) {
      console.error(`Error updating status for request ${id}:`, error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/requests/delete/${id}`);
      setRequestsComplaints(prevRequests => prevRequests.filter(request => request._id !== id));
      fetchRequestsComplaints();
      console.log(`Request ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting request ${id}:`, error);
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
      <h2 className="text-center mb-4" style={{ fontSize: '28px' }}>Requests and Complaints</h2>

      {/* Button to open modal */}
      {!isAdmin && (
        <div className="mb-3">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            Make a New Request
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Request</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <select
                  name="type"
                  value={newRequest.type}
                  onChange={handleInputChange}
                  className="form-select mb-2"
                >
                  <option value="" disabled>Select Request Type</option>
                  <option value="request">Request</option>
                  <option value="complaint">Complaint</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={newRequest.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="form-control mb-2"
                />
              </div>
              <div className="modal-footer">
                <button onClick={handleSubmitRequest} className="btn btn-success">Submit</button>
                <button onClick={() => setShowModal(false)} className="btn btn-danger">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Requests and Complaints Table */}
      <table className="table table-striped table-bordered text-center" style={{ width: '85%' }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            {isAdmin && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {requestsComplaints.map((requestComplaint) => (
            <tr key={requestComplaint._id} style={{ backgroundColor: 'rgba(59, 59, 59, 0.7)' }}>
              <td>{new Date(requestComplaint.createdAt).toLocaleDateString()}</td>
              <td>{requestComplaint.type}</td>
              <td>{requestComplaint.description}</td>
              <td>
                {isAdmin ? (
                  <select
                    value={requestComplaint.status}
                    onChange={(e) => handleStatusChange(requestComplaint._id, e.target.value)}
                    className="form-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                ) : (
                  requestComplaint.status
                )}
              </td>
              {isAdmin && (
                <td>
                  <button
                    onClick={() => handleUpdate(requestComplaint._id, requestComplaint.status)}
                    className="btn btn-info me-2"
                  >
                    Update
                  </button>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => handleDelete(requestComplaint._id)}
                    style={{
                      color: '#e74c3c',
                      cursor: 'pointer',
                      fontSize: '20px'
                    }}
                    title="Delete Request"
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsComplaints;
