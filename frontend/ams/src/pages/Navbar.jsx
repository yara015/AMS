import React, { useContext ,useState} from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/UserContext'
import { Form } from 'react-bootstrap';
import { NotificationImportant, AccountCircle, People, Close} from '@mui/icons-material';
import { IconButton, Dialog, DialogTitle, DialogContent, Menu, MenuItem,TextField, Button, Container, Typography, Grid,List, ListItem, ListItemText, } from '@mui/material'
// import { IconButton } from '@mui/material';
import UpdateFamilyDialog from './Tenant/updatefamily';
import { useNavigate } from 'react-router-dom';
import Profile from './Profile';
import Documents from './Tenant/Documents';
const Navbar = () => {
  const navigate=useNavigate();
  const { user, setUser } = useContext(DataContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isLoggedIn = !!user;  // Check if user is logged in
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
      // Remove user-related data from localStorage
      await localStorage.removeItem('token');
      await localStorage.removeItem('userData');
  
      // Clear user state
      setUser(null);
  
      // Close the profile menu
      handleProfileMenuClose();
  
      // Redirect to the home page
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
      await api.put(`/auth/change-password`, data);
      alert("Password changed successfully!");
      handleDialogClose(setOpenChangePassword);
    } catch (error) {
      alert(error.response.data.errors[0]);
    }
  };

  const handleLoginToggle = () => {
    if (!isLoggedIn) {
      // Logout: clear user data in context and local storage
      window.location.href = '/login';
      // setUser(null);
      // localStorage.removeItem("userData");
      // localStorage.removeItem("token");
    } 
  };

  const navbarStyles = {
    backgroundColor: '#2b3844',
    color: 'white',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    padding: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    <nav style={navbarStyles}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div>
          <img src="images/logofinal.png" alt="Logo" style={{ height: '3.5rem', borderRadius: '50%' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Hitech Apartments</span>
        </div>

        <div style={{ display: 'flex', gap: '2rem' }}>
          {isLoggedIn && (
            <>
            <Link to={isAdmin ? '/admin' : '/tenant'} style={{ color: 'white' }}>Home</Link>
              <Link to="/announcements" style={{ color: 'white' }}>Announcements</Link>
              <Link to="/payments" style={{ color: 'white' }}>Payments</Link>
              <Link to="/requests" style={{ color: 'white' }}>Requests</Link>
              {/* <Link to="/events" style={{ color: 'white' }}>Events</Link> */}
              <Link to="/flats" style={{ color: 'white' }}>Flats</Link>
              <Link to="/feedbacks" style={{ color: 'white' }}>Feedbacks</Link>
            </>
          )}
        </div>
        <div>
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {isAdmin && (
                <>
                  <IconButton onClick={()=>{navigate('/notifications')}} style={{ color: 'white' }}>
                    <NotificationImportant />
                  </IconButton>
                  <IconButton style={{ color: 'white' }} onClick={() => navigate('/Users')}>
                    <People />
                  </IconButton>
                  <IconButton onClick={handleProfileMenuOpen} style={{ color: 'white' }}>
                    <AccountCircle />
                  </IconButton>
                </>
              )}
              {isTenant && (
                <>
                  <IconButton onClick={()=>{navigate('/notifications')}} style={{ color: 'white' }}>
                    <NotificationImportant />
                  </IconButton>
                  <IconButton onClick={handleProfileMenuOpen} style={{ color: 'white' }}>
                    <AccountCircle />
                  </IconButton>
                </>
              )}
            </div>
          ) : (
            <button onClick={handleLoginToggle} style={{ color: 'white' }}>Login</button>
          )}
        </div>
      </div>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
              <MenuItem onClick={() => handleDialogOpen(setOpenProfile)}>View Profile</MenuItem>
              {isTenant && (
                <>
                <MenuItem onClick={() => handleDialogOpen(setOpenFamilyInfo)}>Update Family Info</MenuItem>
                <MenuItem onClick={() => handleDialogOpen(setOpenUploadDocuments)}>Upload Documents</MenuItem>
                <MenuItem onClick={() => handleDialogOpen(setOpenUpdateProfile)}>Update Profile</MenuItem>
                </>
              )}
              <MenuItem onClick={() => handleDialogOpen(setOpenChangePassword)}>Change Password</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

    <Dialog open={openProfile} onClose={() => handleDialogClose(setOpenProfile)} maxWidth="md" fullWidth>
    <DialogTitle>
      View Profile
      <IconButton style={styles.closeButton} onClick={() => handleDialogClose(setOpenProfile)}>
        <Close />
      </IconButton>
    </DialogTitle>
  <DialogContent>
  {user ? (
    <form>
      <TextField
        label="Name"
        
        value={user.name}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        label="Email"
        value={user.email}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        label="Role"
        value={user.role}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        label="Flat"
        value={user.flat ? user.flat.name : 'Not Assigned'}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        label="Phone Number"
        value={user.phoneNumber || 'Not Provided'}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />
      <TextField
        label="Emergency Contact"
        value={user.emergencyContact || 'Not Provided'}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />
    
      <Typography style={styles.listTitle}>Family Members:</Typography>
      {user.familyMembers && user.familyMembers.length > 0 ? (
        <List>
          {user.familyMembers.map((member, index) => (
            <TextField
              key={index}
              label={`${member.name} (${member.relation})`}
              value={member.relation}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          ))}
        </List>
      ) : (
        <Typography>No family members listed.</Typography>
      )}

      <Typography style={styles.listTitle}>Documents:</Typography>
      {user.documents && user.documents.length > 0 ? (
        <List>
          {user.documents.map((doc, index) => (
            <TextField
              key={index}
              label="Document"
              value={doc}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          ))}
        </List>
      ) : (
        <Typography>No documents uploaded.</Typography>
      )}
    </form>
  ) : (
    <Typography variant="body1">Loading...</Typography> // Fallback content while user is loading
  )}
</DialogContent>
      </Dialog>
      
      <Dialog open={openFamilyInfo} onClose={() => handleDialogClose(setOpenFamilyInfo)} maxWidth="md" fullWidth>
        <UpdateFamilyDialog/>
      </Dialog>

      <Dialog open={openUpdateProfile} onClose={() => handleDialogClose(setOpenUpdateProfile)} maxWidth="md" fullWidth>
        <Profile/>
      </Dialog>

      <Dialog open={openUploadDocuments} onClose={() => handleDialogClose(setOpenUploadDocuments)}>
  <DialogTitle>
    Upload Documents
    <IconButton style={{ position: 'absolute', right: 8, top: 8 }} 
    onClick={() => handleDialogClose(setOpenUploadDocuments)} maxWidth="md" fullWidth>
      <Close />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    <Documents/>
  </DialogContent>
</Dialog>


      <Dialog open={openChangePassword} onClose={() => handleDialogClose(setOpenChangePassword)} maxWidth="md" fullWidth>
        <DialogTitle>
          Change Password
          <IconButton style={styles.closeButton} onClick={() => handleDialogClose(setOpenChangePassword)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
        <form onSubmit={handleChangePasswordSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Old Password"
                                    name="oldPassword"
                                    type="password"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">
                                    Change Password
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
      </Dialog>

    </nav>
  );
};

export default Navbar;
