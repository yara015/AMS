import React, { useState, useContext } from 'react';
import { NotificationImportant, AccountCircle, People, Close } from '@mui/icons-material';
import { IconButton, Dialog, DialogTitle, DialogContent, Menu, MenuItem, TextField, Button, Typography, List } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/UserContext';
import Profile from '../Profile';
import UpdateFamilyDialog from './updatefamily';
import api from '../../utils/api';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(DataContext);
  const [anchorEl, setAnchorEl] = useState(null);
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
      await api.post(`/auth/logout`);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      navigate('/login');
    } catch (error) {
      alert(error.response.data.errors[0]);
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
      await api.put(`/auth/change-password`, data);
      alert("Password changed successfully!");
      handleDialogClose(setOpenChangePassword);
    } catch (error) {
      alert(error.response.data.errors[0]);
    }
  };

  const styles = {
    mainContent: {
      padding: '20px',
      backgroundColor: '#f4f4f4',
      minHeight: '100vh',
      overflowY: 'auto',
      width:'100vh'
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#004d40',
      color: 'white',
      position: 'fixed',
      height:'4rem',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
    },
    dialogTitle: {
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      right: '16px',
      top: '16px',
    },
  };

  return (
    <div style={styles.mainContent}>
      <header style={styles.navbar}>
        <Typography variant="h6">Hitech Apartments</Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={() => navigate('/notifications')}>
            <NotificationImportant />
          </IconButton>
          <IconButton color="inherit" onClick={() => navigate('/Admin/getAllUsers')}>
            <People />
          </IconButton>
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
            <MenuItem onClick={() => handleDialogOpen(setOpenProfile)}>View Profile</MenuItem>
            <MenuItem onClick={() => handleDialogOpen(setOpenFamilyInfo)}>Update Family Info</MenuItem>
            <MenuItem onClick={() => handleDialogOpen(setOpenUploadDocuments)}>Upload Documents</MenuItem>
            <MenuItem onClick={() => handleDialogOpen(setOpenChangePassword)}>Change Password</MenuItem>
            <MenuItem onClick={() => handleDialogOpen(setOpenUpdateProfile)}>Update Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </header>

      {/* Profile Dialog */}
      <Dialog open={openProfile} onClose={() => handleDialogClose(setOpenProfile)} maxWidth="md" fullWidth>
        <DialogTitle>
          View Profile
          <IconButton style={styles.closeButton} onClick={() => handleDialogClose(setOpenProfile)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {user ? (
            <>
              <TextField label="Name" value={user.name} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              <TextField label="Email" value={user.email} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              <TextField label="Role" value={user.role} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              <TextField label="Flat" value={user.flat?.name || 'Not Assigned'} fullWidth margin="normal" InputProps={{ readOnly: true }} />
              <Typography>Family Members:</Typography>
              {user.familyMembers?.length > 0 ? (
                <List>
                  {user.familyMembers.map((member, index) => (
                    <TextField key={index} label={`${member.name} (${member.relation})`} value={member.relation} fullWidth margin="normal" InputProps={{ readOnly: true }} />
                  ))}
                </List>
              ) : (
                <Typography>No family members listed.</Typography>
              )}
            </>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
      </Dialog>

      {/* Other dialogs here (e.g., Update Family Info, Upload Documents, Change Password, Update Profile) */}
      
    </div>
  );
};

export default TenantDashboard;
