import React, { useContext } from 'react';
import { Form, Button, Container, Row, Col, FloatingLabel, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../url';
import { DataContext } from '../context/UserContext'; // Import your DataContext

function ResetPassword() {
    const navigate = useNavigate();
    const { setData } = useContext(DataContext); // Access context to update profile

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            newPassword: formData.get('Password'),
            confirmpassword: formData.get('confirmpassword'),
        };

        try {
            const response = await axios.post(`${URL}/auth/reset-password`, data);
            console.log(response.data);
            alert("Password changed successfully!");

            // Update context here if needed, based on response or other logic
            setData({ ...response.data.userProfile }); // Update profile context if user data is returned

            navigate('/login');
        } catch (error) {
            console.error('There was an error resetting the password!', error);
            alert(error.response?.data?.errors[0] || 'An error occurred, please try again.');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <style>{`
                .reset-password-container {
                    background: linear-gradient(to right, #4facfe, #00f2fe);
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .reset-password-form {
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
                    padding: 2rem;
                    max-width: 400px;
                    width: 100%;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .reset-password-form:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
                }

                .reset-password-form .btn-warning {
                    background-color: #ff9900;
                    border: none;
                    border-radius: 8px;
                    transition: background-color 0.3s ease, transform 0.3s ease;
                }

                .reset-password-form .btn-warning:hover {
                    background-color: #cc7a00;
                    transform: scale(1.05);
                }

                .footer-text {
                    font-size: 0.8rem;
                    color: #777;
                }
            `}</style>
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={8} lg={6} className="text-center">
                    <main className="reset-password-form">
                        <h1 className="h3 mb-4 fw-normal">Reset Password</h1>
                        <Form onSubmit={handleSubmit}>
                            <FloatingLabel controlId="formPassword" label="New Password" className="mb-3">
                                <Form.Control name="Password" type="password" placeholder="Password" required />
                            </FloatingLabel>
                            <FloatingLabel controlId="formConfirmPassword" label="Confirm Password" className="mb-3">
                                <Form.Control name="confirmpassword" type="password" placeholder="Confirm Password" required />
                            </FloatingLabel>
                            <Button variant="warning" type="submit" className="w-100 py-2 mt-3">Submit</Button>
                        </Form>
                        <p className="footer-text text-center mt-4">© 2024</p>
                    </main>
                </Col>
            </Row>
        </Container>
    );
}

export default ResetPassword;
