// Profile.js
import React, { useState,useContext } from 'react';
import { TextField, Button, Container, Typography, Grid, Paper } from '@mui/material';
import { IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Close } from '@mui/icons-material';
import axios from 'axios';
import { DataContext } from '../context/UserContext';
import { URL } from '../url';
import api from '../utils/api';
const Profile = () => {
    const { data} = useContext(DataContext);  
    const [profile, setProfile] = useState({
      name: data.name,
      email: data.email,
      phoneNumber:data.phoneNumber,
      emergencyContact:data.emergencyContact,
      documents: [] // Initialize with empty array
    });
    // const [openChangePassword, setOpenChangePassword] = useState(false);
    const handleChange = (e) => {
      const { name, value } = e.target;
      setProfile({ ...profile, [name]: value });
    };
   
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phoneNumber:formData.get('phoneNumber'),
            emergencyContact: formData.get('emergencyContact'),
        };

        try {
            const response = await api.put(`/auth/profile`, data);
            console.log(response.data);
            alert("profile updated Successfully!!");
            //handleChangePasswordClose();

        } catch (error) {
            
            console.error('There was an error while !', error);
            alert(error.response.data.errors[0]);
            
        }
    };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5">Profile</Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                name="name"
                value={profile.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                fullWidth
                required
                type="email"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">Documents</Typography>
              {profile.documents.length > 0 ? (
                <ul>
                  {profile.documents.map((doc, index) => (
                    <li key={index}>
                      <a href={doc} target="_blank" rel="noopener noreferrer">
                        {doc}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No documents uploaded.</Typography>
              )}
            </Grid>
            <Grid item xs={12}>
            {/* <Button variant="outlined" color="primary" onClick={handleChangePasswordOpen} style={{ marginLeft: '20px', marginRight:'20px'}}>
                                Change Password
                            </Button> */}
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;
