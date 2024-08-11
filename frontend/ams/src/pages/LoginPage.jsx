import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DataContext } from '../Context/UserContext';
import { URL } from '../url';

export default function LoginPage() {
    const navigate = useNavigate();
    const { setData, setToken } = useContext(DataContext);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password'),
        };

        try {
            const response = await axios.post(`${URL}/auth/login`, data);
            console.log(response.data);
            setData(response.data.data);
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userData', JSON.stringify(response.data.data));
            navigate('/home');
            window.location.reload(true);
            console.log('Login Successful');
            alert('Login Successful');
        } catch (error) {
            setErrorMessage(`${error.response.data.errors[0]}`);
            console.error('There was an error logging in!', error);
           // alert(error.response.data.errors[0]);
        }
    };

    return (
        <Container className="container">
            <style>{`
                .container {
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0 15px;
                }
                .logo-section {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 2rem;
                }

                .logo-section img {
                    max-width: 120px;
                    height: auto;
                    border-radius: 50%;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                }

                .form-signin {
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
                    padding: 1.5rem;
                    margin: 0 auto;
                    max-width: 450px;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .form-signin:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
                }

                .form-signin .form-control {
                    border-radius: 8px;
                    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
                }

                .form-signin .form-floating {
                    margin-bottom: 1rem;
                }

                .form-signin .btn-warning {
                    background-color: #ff9900;
                    border: none;
                    border-radius: 8px;
                    padding: 0.75rem 1.5rem;
                    transition: background-color 0.3s ease, transform 0.3s ease;
                }

                .form-signin .btn-warning:hover {
                    background-color: #cc7a00;
                    transform: scale(1.05);
                }

                .form-signin .btn-warning:focus {
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(255, 153, 0, 0.5);
                }

                .text-center {
                    color: #333;
                }

                .text-dark {
                    color: #333;
                    text-decoration: none;
                    font-weight: bold;
                }

                .text-dark:hover {
                    color: #555;
                }

                .alert-danger {
                    background-color: #f8d7da;
                    border-color: #f5c6cb;
                    color: #721c24;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                    text-align: center;
                    font-weight: bold;
                }

                .alert-danger p {
                    margin: 0;
                }

                .footer {
                    font-size: 0.9rem;
                    color: #777;
                    margin-top: 1rem;
                }

                @media (max-width: 576px) {
                    .form-signin {
                        padding: 1.5rem;
                    }
                     .logo-section {
                        margin-right: 0;
                        margin-bottom: 1rem;
                        justify-content: center;
                    }
                }
            `}</style>

            <Row className="w-100 justify-content-center">
                <Col xs={12} md={8} lg={6} className="text-center">
                {/* <div className="logo-section mb-4">
                        <img src="C:/Users/Yarap/Desktop/AMS/frontend/ams/src/utilities/logofinal.png" alt="Logo" width="150" height="150" />
                    </div> */}
                    <main className="form-signin">
                        <Form onSubmit={handleSubmit}>
                            <h1 className="text-center h3 mb-3 fw-normal">Login</h1>
                            <FloatingLabel controlId="floatingInput" label="Email address">
                                <Form.Control name="email" type="email" placeholder="name@example.com" required />
                            </FloatingLabel>
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control name="password" type="password" placeholder="Password" required />
                            </FloatingLabel>
                            <Button variant="warning" className="w-100 py-2 mt-3" type="submit">Login</Button>
                            <div className="text-center mt-3">
                                <Link to='/login/forgot-password' className='text-dark'>forgotpassword</Link>
                            </div>
                            <div className="text-center mt-3">
                                <Link to='/register' className='text-dark'>Don't have an account? Register here</Link>
                            </div>
                            <p className="footer text-center mt-5 mb-3">© 2024</p>
                        </Form>
                        {errorMessage && <div className="alert-danger text-center">{errorMessage}</div>}
                    </main>
                </Col>
            </Row>
        </Container>
    );
}
