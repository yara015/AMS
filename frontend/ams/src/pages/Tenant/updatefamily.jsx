import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  
  MenuItem,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { DataContext } from '../../Context/UserContext';
import api from '../../utils/api'; // Replace with your API utility file if needed

const UpdateFamilyDialog = ({ }) => {
  const { data } = useContext(DataContext); // Assuming DataContext provides user data
  const [familyMembers, setFamilyMembers] = useState(data.familyMembers);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
 
  const handleAdd = async () => {
    if (name && relation) {
    
        // Update local state first
        const newMember = { name, relation };
        const updatedMembers = [...familyMembers, newMember];
        setFamilyMembers(updatedMembers);
        console.log(familyMembers);

        try {
            const response = await api.put('/tenants/family-info', familyMembers );
            console.log(response.data);
            setName('');
            setRelation('');
            alert("family member added successfully");
        } catch (error) {
            console.error('There was an error changing the password!', error);
            alert(error.response.data.errors[0]);
        }
  };
}


  return (
        <Container component="main" maxWidth="md">
          <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h5">Family Members</Typography>
            <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }} style={{ marginTop: '20px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Relationship"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Add Member
                  </Button>
                </Grid>
              </Grid>
            </form>
            <List>
              {familyMembers.length > 0 ? (
                familyMembers.map((member, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={`${member.name} - ${member.relation}`} />
                  </ListItem>
                ))
              ) : (
                <Typography>No family members added yet.</Typography>
              )}
            </List>
            
          </Paper>
        </Container>
     
  );
};

export default UpdateFamilyDialog;
