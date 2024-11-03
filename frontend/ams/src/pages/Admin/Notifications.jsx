import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import api from '../../utils/api'; // Adjust path if needed
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import { FaTrashAlt, FaEnvelopeOpen, FaEnvelope } from 'react-icons/fa'; // Updated icons
import { Modal } from 'react-bootstrap'; // Import Bootstrap modal
import { toast} from 'react-toastify';
import ToastCont from '../toastCont';
const NotificationsList = () => {
  const [mailNotifications, setMailNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [notificationsPerPage, setNotificationsPerPage] = useState(10);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectMode, setSelectMode] = useState(false);

  useEffect(() => {
    fetchMailNotifications();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [notificationsPerPage]);

  const fetchMailNotifications = async () => {
    try {
      const res = await api.get(`/notifications`);
      const sortedNotifications = res.data.notifications.sort((a, b) => {
        if (a.isRead === b.isRead) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.isRead ? 1 : -1;
      });

      setMailNotifications(sortedNotifications);
      setTotalNotifications(sortedNotifications.length);
    } catch (error) {
      console.error('Error fetching mail notifications:', error);
      toast.error('Failed to load notifications');
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleNotificationsPerPageChange = (event) => {
    setNotificationsPerPage(Number(event.target.value));
  };

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications((prevSelected) =>
      prevSelected.includes(notificationId)
        ? prevSelected.filter((id) => id !== notificationId)
        : [...prevSelected, notificationId]
    );
  };

  const openModal = async (notification) => {
    setSelectedNotification(notification);
    setShowModal(true);

    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/read/${notificationId}`);
      fetchMailNotifications();
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const markAsUnread = async (notificationId) => {
    try {
      await api.put(`/notifications/unread/${notificationId}`);
      fetchMailNotifications();
      toast.info('Marked as unread');
    } catch (error) {
      console.error('Error marking notification as unread:', error);
      toast.error('Failed to mark as unread');
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      fetchMailNotifications();
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const deleteSelectedNotifications = async () => {
    try {
      await Promise.all(
        selectedNotifications.map((id) => api.delete(`/notifications/${id}`))
      );
      setSelectedNotifications([]);
      fetchMailNotifications();
      toast.success('Selected notifications deleted');
    } catch (error) {
      console.error('Error deleting selected notifications:', error);
      toast.error('Failed to delete selected notifications');
    }
  };
  // Calculate the current notifications to display
  const indexOfLastNotification = (currentPage + 1) * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = mailNotifications.slice(indexOfFirstNotification, indexOfLastNotification);

  return (
    <div className="container my-5">
    <div style={{ height: "6rem" }}></div>
      <h1 className="text-center mb-4" style={{color:"#fff"}}>Notifications</h1>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
        <label htmlFor="usersPerPage" className="form-label text-light">Users per page</label>
          <select
            id="notificationsPerPage"
            className="form-select form-select-sm d-inline-block w-auto"
            value={notificationsPerPage}
            onChange={handleNotificationsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
              setSelectMode(!selectMode);
              setSelectedNotifications([]);
            }}
        >
        select
        </button>
        <button
          className="btn btn-danger"
          onClick={deleteSelectedNotifications}
          disabled={selectedNotifications.length === 0}
        >
          Delete Selected
        </button>
      </div>

      <div className="list-group">
        {currentNotifications.map((notification) => (
          <div
            key={notification._id}
            className={`list-group-item d-flex justify-content-between align-items-center border rounded shadow-sm mb-2 p-3 ${
              notification.isRead ? 'bg-light text-muted' : 'bg-white'
            }`}
            style={{
              cursor: 'pointer',
              transition: '0.2s',
            }}
      
            onClick={() => {
              if(!selectMode)openModal(notification)}
            }
           
          >
            <div className="form-check">
              {selectMode && (
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedNotifications.includes(notification._id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectNotification(notification._id);
                  }}
                />
              )}
              <div className={`notification-message ${notification.isRead ? 'text-muted' : ''}`}>
                <strong>{notification.sender}</strong>: {notification.message}
                <div className="notification-date text-muted">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div>
              {notification.isRead ? (
                <button
                  className="btn btn-outline-secondary btn-sm me-2"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    markAsUnread(notification._id);
                  }}
                  title="Mark as Unread"
                >
                  <FaEnvelope />
                </button>
              ) : (
                <button
                  className="btn btn-outline-primary btn-sm me-2"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    markAsRead(notification._id);
                  }}
                  title="Mark as Read"
                >
                  <FaEnvelopeOpen />
                </button>
              )}
              <button
                className="btn btn-danger btn-sm"
                style={{ border: 'none' }}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification._id);
                }}
                title="Delete Notification"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying notification content */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Notification Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedNotification && (
            <div>
              <strong>From: {selectedNotification.sender}</strong>
              <p>{selectedNotification.message}</p>
              <p><em>{new Date(selectedNotification.createdAt).toLocaleString()}</em></p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
      <div>
        <ToastCont/>
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
