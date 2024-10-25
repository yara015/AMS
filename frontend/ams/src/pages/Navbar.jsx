import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const navbarStyles = {
    backgroundColor: '#2b3844',
    color: 'white',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    padding: '1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const containerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '0 1rem',
  };

  const logoContainerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    justifyContent: 'flex-start',
  };

  const logoImgStyles = {
    height: '3.5rem',
    width: '3.5rem',
    objectFit: 'contain',
    borderRadius: '50%',
  };

  const companyNameStyles = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const navLinksContainerStyles = {
    display: 'flex',
    justifyContent: 'center',
    flex: 1,
    gap: '2rem',
    fontSize: '1rem',
    fontWeight: '500',
  };

  const navLinkStyles = {
    color: 'white',
    textDecoration: 'none',
    transition: 'color 0.3s',
  };

  const notificationStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '1rem',
  };

  const notificationIconStyles = {
    height: '1.5rem',
    width: '1.5rem',
  };

  const bellIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="white"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V9c0-3.07-1.63-5.64-4.5-6.32V2c0-.83-.67-1.5-1.5-1.5S10 1.17 10 2v.68C7.13 3.36 5.5 5.92 5.5 9v7l-1.5 1.5v.5h16v-.5L18 16zM16 17H8v-8c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v8z" />
    </svg>
  );

  return (
    <nav style={navbarStyles}>
      <div style={containerStyles}>

        {/* Logo and Company Name aligned to the leftmost */}
        <div style={logoContainerStyles}>
          <img src="images/logofinal.png" alt="Logo" style={logoImgStyles} />
          <span style={companyNameStyles}>Hitech Apartments</span>
        </div>

        {/* Center Nav links */}
        <div style={navLinksContainerStyles}>
        <Link to="./" style={navLinkStyles} onMouseOver={e => e.target.style.color = 'gray'} onMouseOut={e => e.target.style.color = 'white'}>Home</Link>
          <Link to="/announcements" style={navLinkStyles} onMouseOver={e => e.target.style.color = 'gray'} onMouseOut={e => e.target.style.color = 'white'}>Announcements</Link>
          <Link to="/payments" style={navLinkStyles} onMouseOver={e => e.target.style.color = 'gray'} onMouseOut={e => e.target.style.color = 'white'}>Payments</Link>
          <Link to="/requests" style={navLinkStyles} onMouseOver={e => e.target.style.color = 'gray'} onMouseOut={e => e.target.style.color = 'white'}>Requests</Link>
          <Link to="/events" style={navLinkStyles} onMouseOver={e => e.target.style.color = 'gray'} onMouseOut={e => e.target.style.color = 'white'}>Events</Link>
          <Link to="/flats" style={navLinkStyles} onMouseOver={e => e.target.style.color = 'gray'} onMouseOut={e => e.target.style.color = 'white'}>Flats</Link>
          <Link to="/feedbacks" style={navLinkStyles} onMouseOver={e => e.target.style.color = 'gray'} onMouseOut={e => e.target.style.color = 'white'}>Feedbacks</Link>
        </div>

        {/* Notification (bell icon) and Profile aligned to the rightmost */}
        <div style={notificationStyles}>
          <Link to="/notifications" style={{ position: 'relative' }}>
            {bellIcon}
          </Link>
          <Link to="/profile" style={navLinkStyles} onMouseOver={e => e.target.style.color = 'gray'} onMouseOut={e => e.target.style.color = 'white'}>My Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
