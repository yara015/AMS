import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../context/UserContext';
import { Button, TextField, Card, CardContent, CardActions, Typography, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import api from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';  // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for toast
import ToastCont from './toastCont';

const Feedback = () => {
  const { user } = useContext(DataContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [myFeedbacks, setMyFeedbacks] = useState([]);
  const [editFeedback, setEditFeedback] = useState(null);
  const [updatedContent, setUpdatedContent] = useState('');
  const [showMyFeedbacks, setShowMyFeedbacks] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
    const interval = setInterval(() => {
      fetchFeedbacks();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/feedbacks');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to fetch feedbacks. Please try again later.'); // Show error toast
    }
  };

  const fetchMyFeedbacks = async () => {
    try {
      const response = await api.get('/feedbacks/tenant');
      setMyFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching your feedback:', error);
      toast.error('Failed to fetch your feedback. Please try again later.'); // Show error toast
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (user.role === 'tenant' && newFeedback.trim()) {
      const newFeedbackObject = {
        content: newFeedback,
        tenant: { name: user.name, _id: user._id },
      };
      setFeedbacks((prevFeedbacks) => [...prevFeedbacks, newFeedbackObject]);
      setNewFeedback('');

      try {
        const response = await api.post('/feedbacks', { content: newFeedback });
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((fb) => (fb.content === newFeedbackObject.content ? response.data : fb))
        );
        toast.success('Feedback submitted successfully!'); // Show success toast
      } catch (error) {
        console.error('Error submitting feedback:', error);
        toast.error('Failed to submit feedback. Please try again.'); // Show error toast
      }
    }
  };

  const handleEditClick = (feedback) => {
    setEditFeedback(feedback);
    setUpdatedContent(feedback.content);
  };

  const handleMyFeedbacks = () => {
    fetchMyFeedbacks();
    setShowMyFeedbacks(true);
  };

  const handleShowAllFeedbacks = () => {
    fetchFeedbacks();
    setShowMyFeedbacks(false);
  };

  const handleFeedbackUpdate = async () => {
    try {
      const response = await api.put(`/feedbacks/${editFeedback._id}`, { content: updatedContent });
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.map((fb) => (fb._id === response.data._id ? response.data : fb))
      );
      setEditFeedback(null);
      toast.success('Feedback updated successfully!'); // Show success toast
    } catch (error) {
      console.error('Error updating feedback:', error);
      toast.error('Failed to update feedback. Please try again.'); // Show error toast
    }
  };

  const handleDeleteClick = async (feedbackId) => {
    try {
      await api.delete(`/feedbacks/${feedbackId}`);
      setFeedbacks(feedbacks.filter(fb => fb._id !== feedbackId));
      toast.success('Feedback deleted successfully!'); // Show success toast
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback. Please try again.'); // Show error toast
    }
  };

  const displayedFeedbacks = showMyFeedbacks ? myFeedbacks : feedbacks;

  return (
    <div style={{ padding: '20px' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick={true} pauseOnHover={true} draggable={true} theme="colored" />
      <div style={{ height: "6.2rem", position: "relative" }}></div>
      <h2 style={{ color: '#007bff' }}>Feedback</h2>

      {user.role === 'tenant' && (
        <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <TextField
            label="Your Feedback"
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            Submit
          </Button>
        </form>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Button variant="outlined" color="primary" onClick={handleMyFeedbacks}>My Feedbacks</Button>
        <Button variant="outlined" color="secondary" onClick={handleShowAllFeedbacks}>Show All Feedbacks</Button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {displayedFeedbacks.map((feedback) => (
          <Card key={feedback._id} variant="outlined" style={{ width: '300px', backgroundColor: 'white', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
            <CardContent>
              <Typography variant="h6" style={{ color: '#28a745' }}>{feedback.content}</Typography>
              <Typography color="textSecondary">Submitted by: {feedback.tenant?.name}</Typography>
            </CardContent>
            <CardActions style={{ position: 'absolute', top: 0, right: 0 }}>
              {user.role === 'tenant' && feedback.tenant?._id === user._id ? (
                <>
                  <IconButton onClick={() => handleEditClick(feedback)} color="primary" style={{ margin: '5px' }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(feedback._id)} color="secondary" style={{ margin: '5px' }}>
                    <Delete />
                  </IconButton>
                </>
              ) : user.role === 'admin' && (
                <IconButton onClick={() => handleDeleteClick(feedback._id)} color="secondary" style={{ margin: '5px' }}>
                  <Delete />
                </IconButton>
              )}
            </CardActions>
          </Card>
        ))}
      </div>

      {editFeedback && (
        <Dialog open={Boolean(editFeedback)} onClose={() => setEditFeedback(null)}>
          <DialogTitle style={{ color: '#007bff' }}>Edit Feedback</DialogTitle>
          <DialogContent>
            <TextField
              label="Edit Feedback"
              value={updatedContent}
              onChange={(e) => setUpdatedContent(e.target.value)}
              fullWidth
              multiline
            />
            <Button onClick={handleFeedbackUpdate} variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Save
            </Button>
          </DialogContent>
        </Dialog>
      )}
      <div><ToastCont/></div>
    </div>
  );
};

export default Feedback;
