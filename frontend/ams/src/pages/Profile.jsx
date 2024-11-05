import React, { useState, useContext, useEffect } from 'react';
import { Button, Container, Form, Row, Col, Alert, ListGroup, Card } from 'react-bootstrap';
import { FaFileUpload, FaRegUser } from 'react-icons/fa';
import { DataContext } from '../Context/UserContext';
import api from '../utils/api';

const Profile = () => {
    const { data, setData } = useContext(DataContext);
    const [profile, setProfile] = useState({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
    });
    const [alert, setAlert] = useState(null);

    // Fetch profile data
    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            setProfile(response.data);
            setData(response.data); // Update context with fetched data
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile(); 
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToUpdate = {
            name: profile.name,
            email: profile.email,
            phoneNumber: profile.phoneNumber, // Phone number is required
        };

        try {
            const response = await api.put('/auth/profile', dataToUpdate);
            setAlert({ type: 'success', message: 'Profile updated successfully!' });
            setData({ ...dataToUpdate, documents: profile.documents }); // Update context
            setProfile(response.data); // Update local profile state with new data
        } catch (error) {
            setAlert({ type: 'danger', message: error.response?.data?.errors[0] || 'Failed to update profile.' });
        }
    };

    return (
        <Container className="mt-5">
            <Card className="p-4 shadow">
                <Card.Body>
                    <Card.Title className="text-center mb-4">
                        <FaRegUser className="mr-2" />
                        Profile
                    </Card.Title>
                    {alert && <Alert variant={alert.type}>{alert.message}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col sm={6}>
                                <Form.Group controlId="name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={profile.name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={6}>
                                <Form.Group controlId="phoneNumber">
                                    <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="phoneNumber"
                                        value={profile.phoneNumber}
                                        onChange={handleChange}
                                        required // Make phone number required
                                    />
                                </Form.Group>
                            </Col>
                            <Col sm={12}>
                                <h6>Documents</h6>
                                {profile.documents && profile.documents.length > 0 ? (
                                    <ListGroup>
                                        {profile.documents.map((doc, index) => (
                                            <ListGroup.Item key={index}>
                                                <a href={doc} target="_blank" rel="noopener noreferrer">
                                                    {doc}
                                                </a>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p>No documents uploaded.</p>
                                )}
                            </Col>
                            <Col sm={12} className="mt-3 text-center">
                                <Button type="submit" variant="primary" size="lg">
                                    <FaFileUpload className="mr-2" />
                                    Save Changes
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Profile;
