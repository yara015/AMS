import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons'; 

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [flats, setFlats] = useState([]);

  const fetchUsers = async (page, limit) => {
    setLoading(true);
    try {
      const res = await api.get(`/auth/getAllusers?page=${page + 1}&limit=${limit}`);
      setUsers(res.data.users);
      setTotalUsers(res.data.totalUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlats = async () => {
    try {
      const res = await api.get('/flats');
      setFlats(res.data.flats);
    } catch (error) {
      console.error('Error fetching flats:', error);
      setError('Failed to fetch flats. Please try again.');
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, usersPerPage);
    fetchFlats();
  }, [currentPage, usersPerPage]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handlePageChange = (direction) => {
    if (direction === 'next') {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(totalUsers / usersPerPage) - 1));
    } else if (direction === 'prev') {
      setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    }
  };

  const handleUsersPerPageChange = (event) => {
    setUsersPerPage(Number(event.target.value));
    setCurrentPage(0); // Reset to the first page when changing users per page
  };

  const toggleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };

  const handleFilterRole = (status) => {
    setFilterStatus(status);
    setFilterDropdownVisible(false);
  };

  const filteredUsers = users.filter(user => 
    (filterStatus === 'all' || user.role === filterStatus) &&
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;

  const getFlatNumber = (userId) => {

    const flat = flats.find((flat) => flat.tenant && flat.tenant._id === userId);
    return flat ? flat.number : 'Not Assigned';
  };

  return (
    <div className="container my-4">
    <div style={{ height: "6rem" }}></div>
      <h1 className="text-center text-success mb-4">User List</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ borderRadius: '8px' }}
        />
      </div>
      {/* Users Per Page Selection */}
      <div className="mb-3">
        <label htmlFor="usersPerPage" className="form-label text-light">Users per page:</label>
        <select
          id="usersPerPage"
          className="form-select"
          value={usersPerPage}
          onChange={handleUsersPerPageChange}
          style={{ width: '100px', borderRadius: '8px' }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <table className="table table-striped table-bordered table-hover" style={{ backgroundColor: '#f8f9fa', color: '#343a40' }}>
        <thead className="table-primary">
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>
              Role 
              <span onClick={toggleFilterDropdown} style={{ cursor: 'pointer', marginLeft: '5px' }}>
                <FontAwesomeIcon icon={faFilter} />
              </span>
              {filterDropdownVisible && (
                <div className="dropdown-menu show" style={{ position: 'absolute', zIndex: 1050 }}>
                  <span className="dropdown-item" onClick={() => handleFilterRole('tenant')}>Tenant</span>
                  <span className="dropdown-item" onClick={() => handleFilterRole('admin')}>Admin</span>
                  <span className="dropdown-item" onClick={() => handleFilterRole('all')}>All</span>
                </div>
              )}
            </th>
            <th>Flat Number</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr
              key={user._id}
              onClick={() => handleUserClick(user)}
              style={{
                cursor: 'pointer',
                backgroundColor: user.role === 'tenant' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(0, 123, 255, 0.1)',
                transition: 'background-color 0.3s'
              }}
              className="hover-row"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = user.role === 'tenant' ? 'rgba(40, 167, 69, 0.3)' : 'rgba(0, 123, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = user.role === 'tenant' ? 'rgba(40, 167, 69, 0.1)' : 'rgba(0, 123, 255, 0.1)'}
            >
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{getFlatNumber(user._id)}</td>
              <td>{user.phoneNumber || 'No phone number provided'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-primary"
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 0}
          style={{ borderRadius: '8px' }}
        >
          Previous
        </button>
        <span className="text-dark">Page {currentPage + 1} of {Math.ceil(totalUsers / usersPerPage)}</span>
        <button
          className="btn btn-primary"
          onClick={() => handlePageChange('next')}
          disabled={currentPage >= Math.ceil(totalUsers / usersPerPage) - 1}
          style={{ borderRadius: '8px' }}
        >
          Next
        </button>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="modal fade show" style={{ display: 'block', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content" style={{ borderRadius: '8px' }}>
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button onClick={closeModal} className="btn-close"></button>
              </div>
              <div className="modal-body">
                <table className="table">
                  <tbody>
                    <tr>
                      <td><strong>Username:</strong></td>
                      <td>{selectedUser.name}</td>
                    </tr>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{selectedUser.email}</td>
                    </tr>
                    <tr>
                      <td><strong>Role:</strong></td>
                      <td>{selectedUser.role}</td>
                    </tr>
                    <tr>
                      <td><strong>Flat Number:</strong></td>
                      <td>{getFlatNumber(selectedUser._id)}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone Number:</strong></td>
                      <td>{selectedUser.phoneNumber || 'No phone number provided'}</td>
                    </tr>
                    {/* <tr>
                      <td><strong>Emergency Contact:</strong></td>
                      <td>{selectedUser.emergencyContact || 'Not Provided'}</td>
                    </tr> */}
                    <tr>
                      <td><strong>Family Members:</strong></td>
                      <td>
                        {selectedUser.familyMembers && selectedUser.familyMembers.length > 0 ? (
                          <ul>
                            {selectedUser.familyMembers.map((member, index) => (
                              <li key={index}>{member.name} ({member.relation})</li>
                            ))}
                          </ul>
                        ) : (
                          'No family members assigned'
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Documents:</strong></td>
                      <td>
                        {selectedUser.documents && selectedUser.documents.length > 0 ? (
                          <ul>
                            {selectedUser.documents.map((doc, index) => (
                              <li key={index}>{doc.toString()}</li>
                            ))}
                          </ul>
                        ) : (
                          'No documents uploaded'
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button onClick={closeModal} className="btn btn-secondary" style={{ borderRadius: '8px' }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
