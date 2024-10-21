import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import api from '../../utils/api'; // Adjust this path if needed
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers(currentPage, usersPerPage);
  }, [currentPage, usersPerPage]);

  const fetchUsers = async (page, limit) => {
    try {
      const res = await api.get(`/auth/getAllusers?page=${page + 1}&limit=${limit}`);
      setUsers(res.data.users);
      setTotalUsers(res.data.totalUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleUsersPerPageChange = (event) => {
    setUsersPerPage(Number(event.target.value));
    setCurrentPage(0); // Reset to first page when users per page changes
  };

  const fetchUserById = async (userId) => {
    try {
      const res = await api.get(`/auth/getUser/${userId}`);
      setSelectedUser(res.data.user);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-center">Users List</h1>
        <div>
          <label htmlFor="usersPerPage">Users per page: </label>
          <select
            id="usersPerPage"
            className="form-select form-select-sm"
            value={usersPerPage}
            onChange={handleUsersPerPageChange}
            style={{ width: '80px' }}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Flat</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>
                  <a href="#!" onClick={() => fetchUserById(user._id)} className="text-primary">
                    {user.email}
                  </a>
                </td>
                <td>{user.phoneNumber || 'N/A'}</td>
                <td>{user.flat ? user.flat.Number : 'N/A'}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={Math.ceil(totalUsers / usersPerPage)}
        onPageChange={handlePageClick}
        containerClassName={'pagination justify-content-center mt-4'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        activeClassName={'active'}
        disabledClassName={'disabled'}
      />

      {isDialogOpen && selectedUser && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedUser.name}'s Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeDialog}></button>
              </div>
              <div className="modal-body">
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone Number:</strong> {selectedUser.phoneNumber || 'N/A'}</p>
                <p><strong>Flat Number:</strong> {selectedUser.flat ? selectedUser.flat.Number : 'N/A'}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Emergency Contact:</strong> {selectedUser.emergencyContact || 'N/A'}</p>

                <h6>Family Members:</h6>
                {selectedUser.familyMembers && selectedUser.familyMembers.length > 0 ? (
                  <ul>
                    {selectedUser.familyMembers.map((member, index) => (
                      <li key={index}>
                        {member.name} - {member.relation}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No family members listed.</p>
                )}

                <h6>Documents:</h6>
                {selectedUser.documents && selectedUser.documents.length > 0 ? (
                  <ul>
                    {selectedUser.documents.map((doc, index) => (
                      <li key={index}>
                        <a href={doc} target="_blank" rel="noopener noreferrer">Document {index + 1}</a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No documents available.</p>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDialog}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
