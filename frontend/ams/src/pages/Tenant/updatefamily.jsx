import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { DataContext } from '../../context/UserContext';
import api from '../../utils/api'; // Replace with your API utility file if needed
import { Toast } from 'react-bootstrap';
import ToastCont from '../toastCont';

const UpdateFamilyDialog = () => {
  const { data } = useContext(DataContext); // Assuming DataContext provides user data
  const [familyMembers, setFamilyMembers] = useState(data.familyMembers || []);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');

  const handleAdd = async () => {
    if (name && relation) {
      // Update local state first
      const newMember = { name, relation };
      const updatedMembers = [...familyMembers, newMember];
      setFamilyMembers(updatedMembers);

      try {
        const response = await api.put('/tenants/family-info', updatedMembers);
        console.log(response.data);
        setName('');
        setRelation('');
        toast.success('Family member added successfully!');
      } catch (error) {
        console.error('There was an error adding the family member!', error);
        toast.error('Error adding family member: ' + (error.response?.data?.errors[0] || 'Unknown error'));
      }
    } else {
      toast.error('Please provide both name and relationship.');
    }
  };

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
      <div><ToastCont/></div>
    </Container>
  );
};

export default UpdateFamilyDialog;
