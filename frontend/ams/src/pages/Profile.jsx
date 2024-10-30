import React, { useState, useContext } from 'react';
import { Button, Container, Form, Row, Col, Alert, ListGroup, Modal } from 'react-bootstrap';
import { DataContext } from '../context/UserContext';
import api from '../utils/api';

const Profile = () => {
    const { data } = useContext(DataContext);
    const [profile, setProfile] = useState({
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        emergencyContact: data.emergencyContact,
        documents: []
    });
    const [show, setShow] = useState(false);
    const [alert, setAlert] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            name: profile.name,
            email: profile.email,
            phoneNumber: profile.phoneNumber,
            emergencyContact: profile.emergencyContact,
        };

        try {
            const response = await api.put(`/auth/profile`, data);
            setAlert({ type: 'success', message: 'Profile updated successfully!' });
        } catch (error) {
            setAlert({ type: 'danger', message: error.response.data.errors[0] });
        }
    };

    return (
        <Container className="mt-5">
            <h5>Profile</h5>
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
                                required
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
                                required
                                readOnly
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group controlId="phoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={profile.phoneNumber}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                    <Col sm={12}>
                        <h6>Documents</h6>
                        {profile.documents.length > 0 ? (
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
                    <Col sm={12}>
                        <Button type="submit" variant="primary">Save Changes</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default Profile;
