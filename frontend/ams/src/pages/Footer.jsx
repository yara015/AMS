import React from 'react';

const Footer = () => {
  return (
    <div
      className="footer"
      style={{
        background: "#2b3844",
        color: "#ecf0f1",
        textAlign: "center",
        padding: "1rem",
        marginTop: "auto", // Keep this to push footer down
        fontSize: "0.875rem",
      }}
    >
      <p>&copy; 2024 Apartment Management System. All Rights Reserved.</p>
      <p>
        <a
          href="#"
          style={{
            color: "#ecf0f1",
            textDecoration: "none",
            margin: "0 0.5rem"
          }}
        >
          Contact Us
        </a>
        {" | "}
        <a
          href="#"
          style={{
            color: "#ecf0f1",
            textDecoration: "none",
            margin: "0 0.5rem"
          }}
        >
          Privacy Policy
        </a>
        {" | "}
        <a
          href="#"
          style={{
            color: "#ecf0f1",
            textDecoration: "none",
            margin: "0 0.5rem"
          }}
        >
          Terms of Service
        </a>
      </p>
    </div>
  );
};

export default Footer;
