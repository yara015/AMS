import React from 'react';
import { Form, Button, Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../url';

function Register() {
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmpassword: formData.get('confirmpassword'),
            role: 'tenant', // Only one option, tenant
        };

        try {
            const response = await axios.post(`${URL}/auth/register`, data);
            console.log(response.data);
            alert("Registered Successfully!!");
            navigate('/login');
        } catch (error) {
            console.error('There was an error registering!', error);
            alert(error.response.data.errors[0]);
        }
    };

    return (
        <div>
            <div style={{ height: '6rem' }}></div>
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <style>{`
                    .register-container {
                        width: 100%; 
                        height: 100vh;
                        margin-top: 4rem; /* Adds space above the form */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .register-form {
                        width: 100%;
                        max-width: 400px; /* Adjusted max-width to make it more centered */
                        background-color: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
                        padding: 2rem;
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }

                    .register-form:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
                    }

                    .register-form .form-floating {
                        margin-bottom: 1rem;
                    }

                    .register-form .form-control {
                        border-radius: 8px;
                    }

                    .register-form .btn-warning {
                        background-color: #ff9900;
                        border: none;
                        border-radius: 8px;
                        padding: 0.5rem 1.25rem;
                        transition: background-color 0.3s ease, transform 0.3s ease;
                    }

                    .register-form .btn-warning:hover {
                        background-color: #cc7a00;
                        transform: scale(1.05);
                    }

                    .text-dark {
                        color: #333;
                        text-decoration: none;
                        font-weight: bold;
                    }

                    .footer-text {
                        font-size: 0.8rem;
                        color: #777;
                    }

                    @media (max-width: 576px) {
                        .register-form {
                            padding: 1.5rem;
                        }
                    }
                `}</style>
                <Row className="w-100 justify-content-center">
                    <Col xs={12} md={6} lg={4} className="text-center">
                        <main className="register-form">
                            <h1 className="h3 mb-3 fw-normal">Register</h1>
                            <Form onSubmit={handleSubmit}>
                                <FloatingLabel controlId="formName" label="Name" className="mb-3">
                                    <Form.Control name="name" type="text" placeholder="Ravi Ram" required />
                                </FloatingLabel>
                                <FloatingLabel controlId="formEmail" label="Email address" className="mb-3">
                                    <Form.Control name="email" type="email" placeholder="name@example.com" required />
                                </FloatingLabel>
                                <FloatingLabel controlId="formRole" label="Role" className="mb-3">
                                    <Form.Control name="role" type="text" value="Tenant" disabled readOnly />
                                </FloatingLabel>
                                <FloatingLabel controlId="formPassword" label="Password" className="mb-3">
                                    <Form.Control name="password" type="password" placeholder="Password" required />
                                </FloatingLabel>
                                <FloatingLabel controlId="formConfirmPassword" label="Confirm Password" className="mb-3">
                                    <Form.Control name="confirmpassword" type="password" placeholder="Confirm Password" required />
                                </FloatingLabel>
                                <Button variant="warning" type="submit" className="w-100 py-2 mt-3">Register</Button>
                            </Form>
                            <div className="text-center mt-3">
                                <Link to='/login' className='text-dark'>Already have an account? Login here</Link>
                            </div>
                        </main>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Register;
