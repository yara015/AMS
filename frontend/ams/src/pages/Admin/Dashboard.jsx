import React, { useState,useContext } from 'react';
import { NotificationImportant, AccountCircle, People, Close} from '@mui/icons-material';
import { IconButton, Dialog, DialogTitle, DialogContent, Menu, MenuItem,TextField, Button, Container, Typography, Grid,List, ListItem, ListItemText, } from '@mui/material'
// import { IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { DataContext } from '../../context/UserContext';
import Profile from '../Profile';
import UpdateFamilyDialog from '../Tenant/updatefamily';
import api from '../../utils/api';
const Dashboard = () => {
  const navigate=useNavigate();
  const { user} = useContext(DataContext);
  console.log("User object:", user);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
const [anchorEl, setAnchorEl] = useState(null);
const [openFamilyInfo, setOpenFamilyInfo] = useState(false);
const [openUploadDocuments, setOpenUploadDocuments] = useState(false);
const [openChangePassword, setOpenChangePassword] = useState(false);
const [openUpdateProfile, setOpenUpdateProfile] = useState(false);

const handleProfileMenuOpen = (event) => {
  setAnchorEl(event.currentTarget);
};

const handleProfileMenuClose = () => {
  setAnchorEl(null);
};

const handleDialogOpen = (dialogSetter) => {
  dialogSetter(true);
  handleProfileMenuClose();
};

const handleDialogClose = (dialogSetter) => {
  dialogSetter(false);
};

const handleLogout = async() => {
  try {
    const response=await api.post(`/auth/logout`); 
    localStorage.removeItem('token'); 
    localStorage.removeItem('userData'); 
    navigate('/login');
  } catch (error) {
    console.error("Error during logout:", error);
   alert(error.response.data.errors[0]);
  }
};
  const handleMouseEnter = (index) => {
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };
//   const handleChangePasswordOpen = () => {
//     setOpenChangePassword(true);
// };

// const handleChangePasswordClose = () => {
//     setOpenChangePassword(false);
// };

const handleChangePasswordSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
        oldPassword: formData.get('oldPassword'),
        newPassword: formData.get('newPassword'),
    };

    try {
        const response = await api.put(`${URL}/auth/change-password`, data);
        console.log(response.data);
        alert("Password changed successfully!");
        handleChangePasswordClose(); // Close dialog on success
    } catch (error) {
        console.error('There was an error changing the password!', error);
        alert(error.response.data.errors[0]);
    }
};
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      width: '100%',
    },
    sidebar: {
    width: '300px',
    backgroundColor: '#004d40',
    color: 'white',
    padding: '20px',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
    transition: 'background-color 0.3s',
  },
  // navItem: {
  //   margin: '15px 0',
  //   position: 'relative',
  // },
  // navLink: {
  //   color: 'white',
  //   textDecoration: 'none',
  //   fontSize: '16px',
  //   display: 'flex',
  //   alignItems: 'center',
  //   padding: '10px 15px',
  //   borderRadius: '4px',
  //   transition: 'background-color 0.3s',
  // },
  // navLinkHover: {
  //   backgroundColor: '#00796b',
  // },
  dropdownMenu: {
    backgroundColor: '#004d40',
    color: 'white',
    borderRadius: '4px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    display: 'none',
  },
  dropdownMenuShow: {
    display: 'block',
  },
  dropdownItem: {
    padding: '10px 15px',
    textDecoration: 'none',
    color: 'white',
    display: 'block',
    transition: 'background-color 0.3s',
  },
  dropdownItemHover: {
    backgroundColor: '#00796b',
  },
    logo: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    nav: {
      listStyleType: 'none',
      padding: 0,
    },
    navItem: {
      margin: '20px 0',
      position: 'relative',
      
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '16px',
      display: 'block',
      padding: '10px 15px',
      backgroundColor: '#00695c',
      borderRadius: '4px',
      transition: 'background-color 0.3s ease',
    },
    navLinkHover: {
      backgroundColor: '#00796b',
    },
  
    mainContent: {
      marginLeft: '300px',
      padding: '20px',
      backgroundColor: '#f4f4f4',
      height: '100vh',
      overflowY: 'scroll',
      width: '100%',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      backgroundColor: '#004d40',
      color: 'white',
      position: 'fixed',
      top: 0,
      left: '300px',  // Adjusted to align with the sidebar
      right: 0,
      zIndex: 1,
    },
    navTopLinks: {
      display: 'flex-end',
      gap: '20px',
    },
    navTopLink: {
      color: 'white',
      textDecoration: 'none',
      fontSize: '16px',
      padding: '10px',
      transition: 'background-color 0.3s ease',
    },
    dialogTitle: {
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      right: '16px',
      top: '16px',
    },
    // notificationSymbol: {
    //   fontSize: '20px',
    //   cursor: 'pointer',
    // },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '20px',
      marginTop: '80px', // Added margin to prevent content overlap with navbar
    },
    card: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center',
      color: 'white',
    },
    purple: { backgroundColor: '#6a1b9a' },
    blue: { backgroundColor: '#039be5' },
    yellow: { backgroundColor: '#fbc02d' },
    red: { backgroundColor: '#d32f2f' },
    orange: { backgroundColor: '#fb8c00' },
    darkRed: { backgroundColor: '#c62828' },
    green: { backgroundColor: '#388e3c' },
    darkGrey: { backgroundColor: '#616161' },
    tenantCard: { backgroundColor: '#388e3c' },
    visitorReport: {
      marginTop: '40px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      border: '1px solid #ddd',
      padding: '8px',
      backgroundColor: '#004d40',
      color: 'white',
    },
    td: {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'center',
    },
   
  };
  const features = [
    { name: 'Announcements', subFeatures: ['Create Announcement', 'View Announcements'] },
    { name: 'Payments', subFeatures: ['View Payments', 'Make Payment'] },
    { name: 'Requests/Complaints', subFeatures: ['View Requests', 'Submit Complaint'] },
    { name: 'Resources', subFeatures: ['View Resources', 'Add Resource'] },
    { name: 'Bookings', subFeatures: ['View Bookings', 'Make Booking'] },
    { name: 'Events', subFeatures: ['View Events', 'Create Event'] },
    { name: 'Flats', subFeatures: ['View Flats', 'Add Flat'] },
    { name: 'Feedbacks', subFeatures: ['View Feedbacks', 'Submit Feedback'] },
  ];

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar }>
        <div style={styles.logo}>
          {/* <img src="/images/logofinal.png" alt="Hitech Apartment Logo" style={{ width: '100%' }} /> */}
          <h4>Hitech Apartment Management Sytem</h4>
          {/* <p>Apartment Management</p> */}
        </div>
        <nav>
          <ul style={styles.nav}>
            {features.map((feature, index) => (
              <li
                key={index}
                style={styles.navItem}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <a
                  href={`#${feature.name.toLowerCase().replace(' ', '-')}`}
                  style={{
                    ...styles.navLink,
                    ...(activeDropdown === index && styles.navLinkHover),
                  }}
                >
                  {feature.name}
                </a>
                <div
                  style={{
                    ...styles.dropdownContainer,
                    ...styles.dropdownMenu,
                    ...(activeDropdown === index && styles.dropdownMenuShow),
                  }}
                >
                  {feature.subFeatures.map((subFeature, subIndex) => (
                    <a
                      key={subIndex}
                      href={`#${subFeature.toLowerCase().replace(' ', '-')}`}
                      style={{
                        ...styles.dropdownItem,
                        ...(activeDropdown === index && styles.dropdownItemHover),
                      }}
                    >
                      {subFeature}
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main style={styles.mainContent}>
      <header style={styles.navbar}>
        
          <div style={styles.logosection}>
                        <img src="images/logofinal.png" alt="Logo" width="50" height="50" onClick={() => navigate('/Admin')}/>
                    </div>
            <h2>Hitech Apartments</h2>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton style={{ color: 'white' }} onClick={() => navigate('/Admin/notifications')}>
            <NotificationImportant />
          </IconButton>
          <IconButton style={{ color: 'white' }} onClick={() => navigate('/Admin/getAllUsers')}>
            <People />
          </IconButton>
          <IconButton
            style={{ color: 'white', marginLeft: '20px' }}
            onClick={handleProfileMenuOpen}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={() => handleDialogOpen(setOpenProfile)}>view profile</MenuItem>
            <MenuItem onClick={() => handleDialogOpen(setOpenChangePassword)}>Change Password</MenuItem>
            <MenuItem onClick={() => handleDialogOpen(setOpenUpdateProfile)}>Update Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </header>
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
      <Dialog open={openUpdateProfile} onClose={() => handleDialogClose(setOpenUpdateProfile)} maxWidth="md" fullWidth>
        <DialogTitle>
          Update Profile
          <IconButton style={styles.closeButton} onClick={() => handleDialogClose(setOpenUpdateProfile)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Profile />
        </DialogContent>
      </Dialog>
        <div style={styles.cardsContainer}>
          <div style={{ ...styles.card, ...styles.purple }}>
            <p>Total Flats</p>
            <h2>2</h2>
          </div>
          <div style={{ ...styles.card, ...styles.blue }}>
            <p>Total Allotment</p>
            <h2>0</h2>
          </div>
          <div style={{ ...styles.card, ...styles.yellow }}>
            <p>Total Bills</p>
            <h2>0</h2>
          </div>
          <div style={{ ...styles.card, ...styles.red }}>
            <p>Total Visitor</p>
            <h2>1</h2>
          </div>
          <div style={{ ...styles.card, ...styles.orange }}>
            <p>Unresolved Complaints</p>
            <h2>0</h2>
          </div>
          <div style={{ ...styles.card, ...styles.darkRed }}>
            <p>In Progress Complaints</p>
            <h2>1</h2>
          </div>
          <div style={{ ...styles.card, ...styles.green }}>
            <p>Resolved Complaints</p>
            <h2>0</h2>
          </div>
          <div style={{ ...styles.card, ...styles.darkGrey }}>
            <p>Total Complaints</p>
            <h2>1</h2>
          </div>
          <div style={{ ...styles.card, ...styles.tenantCard }}>
            <p>Total Tenants</p>
            <h2>10</h2>
          </div>
        </div>
        <div style={styles.visitorReport}>
          <h3>Visitor Report</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>2024-08-01</td>
                <td style={styles.td}>John Doe</td>
                <td style={styles.td}>Maintenance</td>
              </tr>
              <tr>
                <td style={styles.td}>2024-08-05</td>
                <td style={styles.td}>Jane Smith</td>
                <td style={styles.td}>Delivery</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
