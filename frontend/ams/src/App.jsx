// src/App.jsx
import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import Register from './pages/Register';
import { UserContextProvider } from './context/UserContext';
import ForgotPassword from './Pages/forgotpassword';
import ResetPassword from './Pages/resetPassword';
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Admin/Dashboard';
import TenantDashboard from './Pages/Tenant/tenantDashboard';
import AnnouncementsList from './pages/Tenant/Announcements';
// import Profile from './Pages/Admin/Profile';
import UsersList from './Pages/Admin/getAllUsers';
import NotificationsList from './Pages/Admin/Notifications';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Footer from './pages/Footer';
import RequestsComplaints from './pages/Tenant/Requests';
// import Dashboard from './Pages/Admin/Dashboard';
function App() {
    return (
        <div>
        <UserContextProvider>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route exact path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/login/reset-password" element={<ResetPassword/>}/>
                <Route path="/Admin" element={<Home />} />
                <Route path="/Tenant" element={<Home />} />
                <Route path="/announcements" element={<AnnouncementsList />} />
                <Route path="/Admin/getAllUsers" element={<UsersList />} />
                <Route path="/Admin/notifications" element={<NotificationsList />} />
                <Route path="/requests" element={<RequestsComplaints />} />
            </Routes>
            <Footer/>
        </UserContextProvider>
        </div>
    );
}

export default App;
