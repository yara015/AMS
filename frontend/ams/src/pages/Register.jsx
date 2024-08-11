import React from 'react';
import { Form, Button, Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import { Link, useNavigate} from 'react-router-dom';
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
        <Container className="d-flex justify-content-center align-items-center vh-100 register-container">
            <style>{`
                .register-container {
                    {/* background: linear-gradient(to right, #ff9a9e, #fad0c4); */}
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .logo-section {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 2rem;
                    margin-top:10rem;
                }

                .logo-section img {
                    max-width: 120px;
                    height: auto;
                    border-radius: 50%;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                .register-form {
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
                    padding: 1rem;
                    max-width: 450px;
                    margin-left: 2rem;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .register-form:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
                }

                .register-form .form-floating {
                    margin-bottom: 0.75rem;
                }

                .register-form .form-control {
                    border-radius: 8px;
                    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
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

                .register-form .btn-warning:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(255, 153, 0, 0.5);
                }

                .text-dark {
                    color: #333;
                    text-decoration: none;
                    font-weight: bold;
                }

                .text-dark:hover {
                    color: #555;
                }

                .footer-text {
                    font-size: 0.8rem;
                    color: #777;
                }

                @media (max-width: 576px) {
                    .register-container {
                        flex-direction: column;
                        align-items: center;
                    }

                    .logo-section {
                        margin-right: 0;
                        margin-bottom: 1rem;
                        justify-content: center;
                    }

                    .register-form {
                        margin-left: 0;
                        max-width: 100%;
                    }
                }
            `}</style>
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={8} lg={6} className="text-center">
                    {/* <div className="logo-section mb-4">
                        <img src="C:/Users/Yarap/Desktop/AMS/frontend/ams/src/utilities/logofinal.png" alt="Logo" width="150" height="150" />
                    </div> */}
                    <main className="register-form">
                        <h1 className="register-heading h3 mb-3 fw-normal">Register</h1>
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
                        <p className="footer-text text-center mt-5 mb-3">© 2024</p>
                    </main>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;