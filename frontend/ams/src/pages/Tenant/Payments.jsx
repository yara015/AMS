import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    paymentType: 'rent',
    receipt: '',
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/payments');
      if (Array.isArray(response.data)) {
        setPayments(response.data);
      } else {
        console.error('Expected an array but got:', response.data);
        setPayments([]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/payments', formData);
      fetchPayments();
      setFormData({ amount: '', paymentType: 'rent', receipt: '' });
    } catch (error) {
      console.error('Error submitting payment:', error);
    }
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
        <h3 className="text-center mb-4">Make a Payment</h3>

        {/* Payment Form */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-8 col-lg-6">
            <form
              onSubmit={handleSubmit}
              className="p-4 rounded"
              style={{
                backgroundColor: 'rgba(51, 51, 51, 0.7)', // Translucent background
              }}
            >
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Amount:
                </label>
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
                <label htmlFor="paymentType" className="form-label">
                  Payment Type:
                </label>
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
                <label htmlFor="receipt" className="form-label">
                  Receipt (URL):
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="receipt"
                  name="receipt"
                  value={formData.receipt}
                  onChange={handleInputChange}
                  placeholder="Enter receipt URL"
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Submit Payment
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Payment History Table */}
        <h3 className="text-center mb-4">Payment History</h3>
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="table-responsive">
              <table className="table table-dark table-striped table-hover text-center rounded">
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td>{payment.tenant?.name || 'N/A'}</td>
                      <td>${payment.amount}</td>
                      <td>{payment.paymentType}</td>
                      <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td>{payment.status}</td>
                      <td>
                        {payment.receipt ? (
                          <a
                            href={payment.receipt}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-info"
                          >
                            View Receipt
                          </a>
                        ) : (
                          'No receipt'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
