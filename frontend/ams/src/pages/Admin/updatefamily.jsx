import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap'; // or any other component library
import { DataContext } from '../../Context/UserContext'; // Adjust the import path as needed
import api from '../../utils/api';

function UpdateFamilyDialog({ show, onHide }) {
    const { user, setUser } = useContext(DataContext);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [newFamilyMember, setNewFamilyMember] = useState({ name: '', relationship: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && user.familyMembers) {
            setFamilyMembers(user.familyMembers);
        }
    }, [user]);

    const handleAddFamilyMember = () => {
        if (newFamilyMember.name && newFamilyMember.relationship) {
            setFamilyMembers([...familyMembers, newFamilyMember]);
            setNewFamilyMember({ name: '', relationship: '' });
        } else {
            setError('Please fill in both fields.');
        }
    };

    const handleRemoveFamilyMember = (index) => {
        setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        try {
            const response = await api.put('/update-family', { family: familyMembers });
            if (response.data.success) {
                setUser(prev => ({ ...prev, familyMembers }));
                onHide();
            } else {
                setError('Failed to update family information.');
            }
        } catch (err) {
            console.error(err);
            setError('Server error. Please try again later.');
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Family Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <ListGroup>
                    {familyMembers.map((member, index) => (
                        <ListGroup.Item key={index}>
                            {member.name} - {member.relationship}
                            <Button variant="danger" onClick={() => handleRemoveFamilyMember(index)} style={{ float: 'right' }}>
                                Remove
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Form>
                    <Form.Group controlId="formFamilyMemberName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={newFamilyMember.name}
                            onChange={(e) => setNewFamilyMember({ ...newFamilyMember, name: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group controlId="formFamilyMemberRelationship">
                        <Form.Label>Relationship</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter relationship"
                            value={newFamilyMember.relationship}
                            onChange={(e) => setNewFamilyMember({ ...newFamilyMember, relationship: e.target.value })}
                        />
                    </Form.Group>
                    <Button variant="primary" onClick={handleAddFamilyMember}>
                        Add
                    </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateFamilyDialog;
