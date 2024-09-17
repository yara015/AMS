// src/App.jsx
import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import Register from './Pages/Register';
import { UserContextProvider } from './Context/UserContext';
import ForgotPassword from './Pages/forgotpassword';
import ResetPassword from './Pages/resetPassword';
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Admin/Dashboard';
// import Profile from './Pages/Admin/Profile';
function App() {
    return (
        <UserContextProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route exact path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/login/reset-password" element={<ResetPassword/>}/>
                <Route path="/Admin" element={<Dashboard />} />
                {/* <Route path="/Profile" element={<Profile />} /> */}
                {/* Add more routes here */}
            </Routes>
        </UserContextProvider>
    );
}

export default App;
