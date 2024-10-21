import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import api from '../../utils/api'; // Adjust path if needed
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap

const NotificationsList = () => {
  const [mailNotifications, setMailNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [notificationsPerPage, setNotificationsPerPage] = useState(10);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    fetchMailNotifications(currentPage, notificationsPerPage);
  }, [currentPage, notificationsPerPage]);

  // Fetch all notifications
  const fetchMailNotifications = async (page, limit) => {
    try {
      const res = await api.get(`/notifications`);
      setMailNotifications(res.data.notifications);
      setTotalNotifications(res.data.notifications.length); // Assuming total count of notifications is returned
    } catch (error) {
      console.error('Error fetching mail notifications:', error);
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleNotificationsPerPageChange = (event) => {
    setNotificationsPerPage(Number(event.target.value));
    setCurrentPage(0); // Reset to first page when notifications per page changes
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications((prevSelected) =>
      prevSelected.includes(notificationId)
        ? prevSelected.filter((id) => id !== notificationId)
        : [...prevSelected, notificationId]
    );
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/markAsRead/${notificationId}`);
      fetchMailNotifications(currentPage, notificationsPerPage); // Refresh list
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-center">Mail Notifications</h1>
        <div>
          <label htmlFor="notificationsPerPage">Per page: </label>
          <select
            id="notificationsPerPage"
            className="form-select form-select-sm"
            value={notificationsPerPage}
            onChange={handleNotificationsPerPageChange}
            style={{ width: '80px' }}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedNotifications(e.target.checked ? mailNotifications.map((n) => n._id) : [])
                  }
                />
              </th>
              <th>Sender</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mailNotifications.map((notification) => (
              <tr
                key={notification._id}
                style={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification._id)}
                    onChange={() => handleSelectNotification(notification._id)}
                  />
                </td>
                <td>{notification.sender || 'System'}</td>
                <td>{notification.message.substring(0, 50)}...</td>
                <td>{new Date(notification.createdAt).toLocaleString()}</td>
                <td>
                  {notification.isRead ? (
                    'Read'
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => markAsRead(notification._id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={Math.ceil(totalNotifications / notificationsPerPage)}
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
    </div>
  );
};

export default NotificationsList;
