import React, { useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, ListItemText, Button, TextField, Typography } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { DataContext } from '../../context/UserContext';
import api from './../../utils/api';

const Documents = () => {
  const { data } = useContext(DataContext);
  const [documents, setDocuments] = useState(data.documents);
  const [newDocument, setNewDocument] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const handleUpload = async () => {
    if (newDocument && title && description) {
      const documentToAdd = {
        name: newDocument.name,
        file: newDocument, 
        title,
        description,
        date: Date.now(),
      };
      
      const updatedDocuments = [...documents, documentToAdd];
      setDocuments(updatedDocuments);
  
      try {
       
        const response = await api.put('/tenants/documents', { documents: updatedDocuments });
        console.log(response.data);
        setTitle('');
        setDescription('');
        setNewDocument(null);
        alert("File uploaded successfully");
      } catch (error) {
        console.error('Error while uploading:', error);
        alert(error.response?.data?.errors?.[0] || 'An error occurred while uploading');
      }
    } else {
      alert("Please fill in all fields before uploading");
    }
  };
  

  const handleDelete = (id) => {
    setDocuments((prevDocuments) => prevDocuments.filter(doc => doc.id !== id));
  };

  const handleFileChange = (event) => {
    setNewDocument(event.target.files[0]);
  };

  const handleOpenFile = (file) => {
    const fileUrl = URL.createObjectURL(file);
    const fileType = file.type;

    if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
      window.open(fileUrl, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <List>
        {documents.map((doc) => (
          <ListItem key={doc.id} secondaryAction={
            <IconButton edge="end" onClick={() => handleDelete(doc.id)}>
              <Delete />
            </IconButton>
          }>
            <ListItemText 
              primary={
                <div>
                  <Typography variant="h6" onClick={() => handleOpenFile(doc.file)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                    {doc.title}
                  </Typography>
                  <Typography variant="body2">{doc.description}</Typography>
                </div>
              }
              secondary={doc.name}
            />
          </ListItem>
        ))}
      </List>

      {/* Upload New Document */}
      <div className="mt-4">
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />
        <TextField
          type="file"
          onChange={handleFileChange}
          inputProps={{ accept: '.pdf, .png, .jpg' }}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          className="mt-2"
          onClick={handleUpload}
          disabled={!newDocument || !title || !description}
        >
          Upload Document
        </Button>
      </div>
    </div>
  );
};

export default Documents;
