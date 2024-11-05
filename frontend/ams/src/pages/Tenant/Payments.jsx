import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import api from '../../utils/api';
import { DataContext } from '../../Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faTrash } from '@fortawesome/free-solid-svg-icons'; 
import {faFilter } from '@fortawesome/free-solid-svg-icons';

import { toast } from 'react-toastify';  
import ToastCont from './../toastCont';
const PaymentPage = () => {
  const { user } = useContext(DataContext);
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    paymentType: 'rent',
    title: '',
    status: 'pending',
    date: null,
    file: null,
    fileType: '',
  });
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const route = isAdmin ? '/payments/all' : '/payments';
      const response = await api.get(route);

      if (Array.isArray(response.data.payments)) {
        setPayments(response.data.payments);
      } else {
        console.error('Expected an array but got:', response.data.payments);
        setPayments([]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, file, fileType: file.type });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
 

  const handleDelete = async (id) => {
    try {
      await api.delete(`/payments/${id}`);
      fetchPayments();
      toast.success('Payment deleted successfully!'); // Success toast
    } catch (error) {
      console.error(`Error deleting payment ${id}:`, error);
      toast.error('Failed to delete payment.'); // Error toast
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const paymentData = new FormData();
      paymentData.append('amount', formData.amount);
      paymentData.append('paymentType', formData.paymentType);
      paymentData.append('title', formData.title);
      paymentData.append('status', formData.status);
      paymentData.append('date', formData.date);
      if (formData.file) {
        paymentData.append('file', formData.file);
        paymentData.append('fileType', formData.fileType);
      }
      await api.post('/payments', paymentData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      fetchPayments();
      setFormData({
        amount: '',
        paymentType: 'rent',
        title: '',
        date: null,
        file: null,
        fileType: '',
      });
      toast.success('Payment submitted successfully!'); // Success toast
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error('Failed to submit payment.'); // Error toast
    }
  };

  const handleView = async (document) => {
    if (Array.isArray(document.file.data)) {
      const blob = new Blob([new Uint8Array(document.file.data)], { type: document.fileType });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      console.error("Invalid document file data");
    }
  };

  const handleUpdate = async (id, status) => {
    try {
      await api.put(`/payments/updateStatus/${id}`, { newstatus: status });
      fetchPayments();
      toast.success('Payment status updated successfully!'); // Success toast
    } catch (error) {
      console.error(`Error updating status for payment ${id}:`, error);
      toast.error('Failed to update payment status.'); // Error toast
    }
  };
 
 
    const handleStatusChange = async (id, newStatus) => {
      setPayments(prevRequests =>
        prevRequests.map(request =>
          request._id === id ? { ...request, status: newStatus } : request
        )
      );
    };
  

  return (
    <div
      className="container-fluid p-4 bg-dark text-white"
      style={{
        backgroundImage: "url('images/ComfyBed.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div style={{ height: '6rem' }}></div>
      <div className="container">
        {!isAdmin && (<h3 className="text-center mb-4">Make a Payment</h3>)}
        {!isAdmin && (
          <div className="row justify-content-center mb-5">
            <div className="col-md-8 col-lg-6">
              <form
                onSubmit={handleSubmit}
                className="p-4 rounded"
                style={{ backgroundColor: 'rgba(51, 51, 51, 0.7)' }}
              >
                <div className="mb-3">
                  <label htmlFor="amount" className="form-label">Amount:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter amount"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="paymentType" className="form-label">Payment Type:</label>
                  <select
                    className="form-select"
                    id="paymentType"
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleInputChange}
                  >
                    <option value="rent">Rent</option>
                    <option value="utility">Utility</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter title"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">Date:</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter date"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="file" className="form-label">Upload File:</label>
                  <input
                    type="file"
                    className="form-control"
                    id="file"
                    name="file"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Submit Payment</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payment History Table */}
        <h3 className="text-center mb-4">Payment History</h3>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="table-responsive">
              <table className="table table-dark table-striped table-hover text-center rounded">
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Amount(in Rs)</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>File</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>{user.name || 'N/A'}</td>
                      <td>{payment.amount}</td>
                      <td>{payment.paymentType}</td>
                      <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td>
                        {isAdmin ? (
                          <select
                            value={payment.status}
                            onChange={(e) => handleStatusChange(payment._id, e.target.value)}
                            className="form-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                          </select>
                        ) : (
                          payment.status
                        )}
                      </td>
                      <td>
                        <button className='btn btn-primary' onClick={() => handleView(payment)}>View Receipt</button>
                      </td>
                      {isAdmin && (
                        <td>
                          <button
                            onClick={() => handleUpdate(payment._id, payment.status)}
                            className="btn btn-info me-2"
                          >
                            Update
                          </button>
                          <FontAwesomeIcon
                            icon={faTrash}
                            onClick={() => handleDelete(payment._id)}
                            style={{
                              color: '#e74c3c',
                              cursor: 'pointer',
                              fontSize: '20px'
                            }}
                            title="Delete Payment"
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ToastCont/>
    </div>
  );
};

export default PaymentPage;
