import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Delete, Download } from '@mui/icons-material';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import ToastCont from '../toastCont';
import { DataContext } from './../../Context/UserContext';
const UploadDocument = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
//  const {dat}=useContext(DataContext)
//   const fetchProfile = async () => {
//     try {
//         const response = await api.get('/auth/profile');
//         // setProfile(response.data);
//         setData(response.data); // Update context with fetched data
//     } catch (error) {
//         console.error('Error fetching profile:', error);
//     }
// };
// useEffect(() => {
//   fetchProfile();

 
//   const interval = setInterval(() => {
//     fetchProfile();
//   }, 5000); 
//   return () => clearInterval(interval); 
// }, []);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      console.log(response.data);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error(`${error.response?.data?.message }`)
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    try {
      await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // alert('Document uploaded successfully!');
      setTitle('');
      setDescription('');
      setFile(null);
      fetchDocuments();
      toast.success('Document uploaded successfully!')
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(`${error.response?.data?.message }`)
      // alert('Error uploading document: ' + (error.response?.data?.message || ''));
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/documents/${id}`);
      
      toast.success('Document deleted successfully!')
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error(`${error.response?.data?.message }`)
      // alert('Error deleting document: ' + (error.response?.data?.message || ''));
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await api.get(`/documents/download/${id}`, { responseType: 'blob' });
      
      // Extract filename from the headers or set a default
      const contentDisposition = response.headers['content-disposition'];
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')  // Gets filename from header if available
        : `${id}.pdf`; // Default filename with extension (adjust based on actual file type)
  
      const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Use the extracted or default filename
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Clean up the URL
      toast.success("Document downloaded successfully");
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error(error.response?.data?.message || 'Error downloading document');
    }
  };
  

  const handleView = async (document) => {
    if (Array.isArray(document.file.data)) {
      const blob = new Blob([new Uint8Array(document.file.data)], { type: document.fileType });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else {
      console.error("Invalid document file data");
    }
  };


  return (
    <div>
      <h2>Upload Document</h2>
      <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <TextField
          label="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Document Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input type="file" onChange={handleFileChange} required />
        <Button type="submit" variant="contained" color="primary">Upload</Button>
      </form>

      <h3>Uploaded Documents</h3>
      <List>
        {documents.map((doc) => (
          <ListItem key={doc._id}>
            <ListItemText 
              primary={<span style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleView(doc)}>{doc.title}</span>}
              secondary={`Uploaded on: ${new Date(doc.date).toLocaleString()}`} 
            />
            <IconButton edge="end" onClick={() => handleDownload(doc._id)}>
              <Download />
            </IconButton>
            <IconButton edge="end" onClick={() => handleDelete(doc._id)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <div><ToastCont/></div>
    </div>
  );
};

export default UploadDocument;
