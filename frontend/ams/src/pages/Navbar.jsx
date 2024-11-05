import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../Context/UserContext';
import { NotificationImportant, AccountCircle, People, Close } from '@mui/icons-material';
import { IconButton, Dialog, DialogTitle, DialogContent, Menu, MenuItem, TextField, Button, Typography, Grid, List, ListItem, ListItemText } from '@mui/material';
import UpdateFamilyDialog from './Tenant/updatefamily';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import Documents from './Tenant/Documents';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../utils/api';
const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(DataContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';
  const isTenant = user?.role === 'tenant';
  const [openProfile, setOpenProfile] = useState(false);
  const [openFamilyInfo, setOpenFamilyInfo] = useState(false);
  const [openUploadDocuments, setOpenUploadDocuments] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openUpdateProfile, setOpenUpdateProfile] = useState(false);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleDialogOpen = (dialogSetter) => {
    dialogSetter(true);
    handleProfileMenuClose();
  };

  const handleDialogClose = (dialogSetter) => dialogSetter(false);

  const handleLogout = async () => {
    try {
      await localStorage.removeItem('token');
      await localStorage.removeItem('userData');
      setUser(null);
      handleProfileMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleChangePasswordSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      oldPassword: formData.get('oldPassword'),
      newPassword: formData.get('newPassword'),
    };

    try {
      await api.put('/auth/change-password', data);
      alert("Password changed successfully!");
      handleDialogClose(setOpenChangePassword);
    } catch (error) {
      alert(error);
    }
  };
  

  const handleLoginToggle = () => {
    if (!isLoggedIn) {
      window.location.href = '/login';
    } 
  };
  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/user'); // Adjust the endpoint as needed
      return response.data;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="images/logofinal.png" alt="Logo" style={{ height: '3.5rem', borderRadius: '50%' }} />

        </Link>
<h2 style={{ color: "white",marginRight:"10px" }}>Hitech</h2>
<h5 style={{ color: "white",marginRight:"70px" }}>Apartments</h5>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={isAdmin ? '/admin' : '/tenant'}>Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/announcements">Announcements</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/payments">Payments</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/requests">Requests</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/flats">Flats</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/feedbacks">Feedbacks</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            {isLoggedIn ? (
              <div className="d-flex align-items-center">
              <IconButton onClick={() => { navigate('/notifications') }} style={{ color: 'white' }}>
                      <NotificationImportant />
                </IconButton>
                
                {isAdmin && (
                  <>
                    <IconButton onClick={() => navigate('/AllUsers')} style={{ color: 'white' }}>
                      <People />
                    </IconButton>
                  </>
                )}
                <IconButton onClick={handleProfileMenuOpen} style={{ color: 'white' }}>
                  <AccountCircle />
                </IconButton>
              </div>
            ) : (
              <button onClick={handleLoginToggle} className="btn btn-light">Login</button>
            )}
          </div>
        </div>
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
        <MenuItem key="1" onClick={() => handleDialogOpen(setOpenProfile)}>View Profile</MenuItem>
        {isTenant && (
          <>
            <MenuItem key="2"  onClick={() => handleDialogOpen(setOpenFamilyInfo)}>Update Family Info</MenuItem>
            <MenuItem key="3" onClick={() => handleDialogOpen(setOpenUploadDocuments)}>Upload Documents</MenuItem>
            <MenuItem key="4" onClick={() => handleDialogOpen(setOpenUpdateProfile)}>Update Profile</MenuItem>
          </>
        )}
        <MenuItem key="5" onClick={() => handleDialogOpen(setOpenChangePassword)}>Change Password</MenuItem>
        <MenuItem key="6" onClick={handleLogout}>Logout</MenuItem>
      </Menu>

      {/* View Profile Dialog */}
      <Dialog open={openProfile} onClose={() => handleDialogClose(setOpenProfile)} maxWidth="md" fullWidth>
        <DialogTitle style={{ backgroundColor: '#343a40', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">View Profile</Typography>
          <IconButton style={{ color: 'white' }} onClick={() => handleDialogClose(setOpenProfile)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
          {user ? (
            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <TextField label="Name" value={user.name} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              <TextField label="Email" value={user.email} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              <TextField label="Role" value={user.role} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              {/* <TextField label="Flat" value={user.flat ? user.flat.name : 'Not Assigned'} fullWidth margin="normal" InputProps={{ readOnly: true }} /> */}
              <TextField label="Phone Number" value={user.phoneNumber || 'Not Provided'} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              {/* <TextField label="Emergency Contact" value={user.emergencyContact || 'Not Provided'} fullWidth margin="normal" InputProps={{ readOnly: true }} /> */}

              <Typography variant="h6" style={{ marginTop: '20px' }}>Family Members:</Typography>
              {user.familyMembers && user.familyMembers.length > 0 ? (
                <List>
                  {user.familyMembers.map((member, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${member.name} (${member.relation})`} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No family members listed.</Typography>
              )}

              <Typography variant="h6" style={{ marginTop: '20px' }}>Documents:</Typography>
              {user.documents && user.documents.length > 0 ? (
                <List>
                  {user.documents.map((doc, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={doc} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>No documents uploaded.</Typography>
              )}
            </form>
          ) : (
            <Typography variant="body1">Loading...</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Family Info Dialog */}
      <Dialog open={openFamilyInfo} onClose={() => handleDialogClose(setOpenFamilyInfo)} maxWidth="md" fullWidth>
        <DialogTitle style={{ backgroundColor: '#343a40', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Update Family Info</Typography>
          <IconButton style={{ color: 'white' }} onClick={() => handleDialogClose(setOpenFamilyInfo)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
          <UpdateFamilyDialog />
        </DialogContent>
      </Dialog>
      <Dialog open={openUpdateProfile} onClose={() => handleDialogClose(setOpenUpdateProfile)} maxWidth="md" fullWidth>
        <DialogTitle style={{ backgroundColor: '#343a40', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Update Profile</Typography>
          <IconButton style={{ color: 'white' }} onClick={() => handleDialogClose(setOpenUpdateProfile)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
          <Profile />
        </DialogContent>
      </Dialog>

      {/* Upload Documents Dialog */}
      <Dialog open={openUploadDocuments} onClose={() => handleDialogClose(setOpenUploadDocuments)} maxWidth="md" fullWidth>
        <DialogTitle style={{ backgroundColor: '#343a40', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Upload Documents</Typography>
          <IconButton style={{ color: 'white' }} onClick={() => handleDialogClose(setOpenUploadDocuments)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
          <Documents />
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openChangePassword} onClose={() => handleDialogClose(setOpenChangePassword)} maxWidth="sm" fullWidth>
        <DialogTitle style={{ backgroundColor: '#343a40', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Change Password</Typography>
          <IconButton style={{ color: 'white' }} onClick={() => handleDialogClose(setOpenChangePassword)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
          <form onSubmit={handleChangePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <TextField type="password" label="Old Password" name="oldPassword" fullWidth required />
            <TextField type="password" label="New Password" name="newPassword" fullWidth required />
            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '15px' }}>Change Password</Button>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
