import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let slideIndex = 0;
    const slides = document.querySelector('.slide-wrapper');
    const slideItems = document.querySelectorAll('.mySlides');

    function showSlides() {
      slideIndex++;
      if (slideIndex >= slideItems.length) {
        slideIndex = 0;
      }
      updateSlides();
      setTimeout(showSlides, 5000); // Change image every 5 seconds
    }

    function plusSlides(n) {
      slideIndex += n;
      if (slideIndex >= slideItems.length) {
        slideIndex = 0;
      } else if (slideIndex < 0) {
        slideIndex = slideItems.length - 1;
      }
      updateSlides();
    }

    function updateSlides() {
      slides.style.transform = 'translateX(' + (-slideIndex * 100) + '%)';
    }

    document.querySelector('.prev').addEventListener('click', () => plusSlides(-1));
    document.querySelector('.next').addEventListener('click', () => plusSlides(1));
    showSlides();
  }, []);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#2b3844", margin: "0", padding: "0", overflowX: "hidden" }}>
      <div style={{ background: "#2b3844", margin: "5px", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "15px" }}>
        <button
          onClick={() => navigate('/login')}
          style={{ backgroundColor: "#2980b9", color: "#ecf0f1", padding: "10px 20px", border: "none", borderRadius: "5px", marginRight: "10px", cursor: "pointer", fontWeight: "bold" }}
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          style={{ backgroundColor: "#27ae60", color: "#ecf0f1", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
        >
          Register
        </button>
      </div>

      <div className="container container-opposite" style={{ position: "relative", margin: "5px", width: "calc(100% - 10px)", height: "700px", backgroundImage: "url('../images/GatedComm.jpg')", backgroundSize: "cover", backgroundPosition: "center right", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", transition: "background-position 1s ease, opacity 1s ease" }}>
        <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", background: "linear-gradient(to right, rgba(43, 56, 68, 0), #2b3844)", zIndex: "1" }}></div>
        <div className="content-left" style={{ position: "absolute", top: "50%", left: "5%", transform: "translateY(-50%)", padding: "40px 20px", borderRadius: "10px", zIndex: "2", maxWidth: "40%", color: "#ffffff", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)", fontSize: "1.2em", background: "rgba(0, 0, 0, 0.5)" }}>
          <h2>About Us</h2>
          <p>Welcome to our premier apartment community, where excellence meets elegance. Our apartments are designed with you in mind, offering the perfect balance of luxury and practicality. Each unit features stunning layouts, high-end finishes, and breathtaking views, ensuring you experience the best in apartment living.</p>
          <p>Enjoy an array of top-tier amenities, from state-of-the-art fitness centers to beautifully landscaped courtyards, all curated to enhance your lifestyle. Located in vibrant neighborhoods, our apartments offer the ideal combination of convenience and tranquility. Join us and elevate your living experience to new heights.</p>
        </div>
      </div>

      <div className="slideshow-container" style={{ position: "relative", maxWidth: "100%", margin: "20px auto", overflow: "hidden" }}>
        <div className="slide-wrapper" style={{ display: "flex", transition: "transform 1s ease" }}>
          <div className="mySlides" style={{ minWidth: "100%", height: "500px", backgroundImage: "url('images/Hall_Cyber.avif')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end" }}>
            <div className="slide-content" style={{ background: "rgba(0, 0, 0, 0.5)", color: "#ffffff", padding: "20px", borderRadius: "10px", maxWidth: "40%", margin: "20px" }}>
              <h2>Modern Themed Rooms</h2>
              <p>Experience the contemporary elegance of our modern themed rooms.</p>
            </div>
          </div>
          <div className="mySlides" style={{ minWidth: "100%", height: "500px", backgroundImage: "url('images/gym_rat.webp')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end" }}>
            <div className="slide-content" style={{ background: "rgba(0, 0, 0, 0.5)", color: "#ffffff", padding: "20px", borderRadius: "10px", maxWidth: "40%", margin: "20px" }}>
              <h2>State-of-the-Art Gyms</h2>
              <p>Stay fit and healthy with our fully equipped modern gyms.</p>
            </div>
          </div>
          <div className="mySlides" style={{ minWidth: "100%", height: "500px", backgroundImage: "url('images/ki.webp')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end" }}>
            <div className="slide-content" style={{ background: "rgba(0, 0, 0, 0.5)", color: "#ffffff", padding: "20px", borderRadius: "10px", maxWidth: "40%", margin: "20px" }}>
              <h2>Modern Kitchens</h2>
              <p>Cook and entertain in our stylish and fully-equipped modern kitchens.</p>
            </div>
          </div>
          <div className="mySlides" style={{ minWidth: "100%", height: "500px", backgroundImage: "url('images/spacious_balcony.jpg')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end" }}>
            <div className="slide-content" style={{ background: "rgba(0, 0, 0, 0.5)", color: "#ffffff", padding: "20px", borderRadius: "10px", maxWidth: "40%", margin: "20px" }}>
              <h2>Spacious Balconies</h2>
              <p>Relax and enjoy the view from our spacious balconies.</p>
            </div>
          </div>
        </div>
        <a className="prev" style={{ cursor: "pointer", position: "absolute", top: "50%", left: "0", width: "auto", marginTop: "-22px", padding: "16px", color: "white", fontWeight: "bold", fontSize: "18px", transition: "0.6s ease", borderRadius: "0 3px 3px 0", userSelect: "none", backgroundColor: "rgba(0,0,0,0.8)" }}>&#10094;</a>
        <a className="next" style={{ cursor: "pointer", position: "absolute", top: "50%", right: "0", width: "auto", marginTop: "-22px", padding: "16px", color: "white", fontWeight: "bold", fontSize: "18px", transition: "0.6s ease", borderRadius: "3px 0 0 3px", userSelect: "none", backgroundColor: "rgba(0,0,0,0.8)" }}>&#10095;</a>
      </div>

      <div className="footer" style={{ background: "#2b3844", color: "#ecf0f1", textAlign: "center", padding: "20px 0", marginTop: "20px", fontSize: "14px" }}>
        <p>&copy; 2024 Apartment Management System. All Rights Reserved.</p>
        <p>
          <a href="#" style={{ color: "#ecf0f1", textDecoration: "none", margin: "0 10px" }}>Contact Us</a> | 
          <a href="#" style={{ color: "#ecf0f1", textDecoration: "none", margin: "0 10px" }}>Privacy Policy</a> | 
          <a href="#" style={{ color: "#ecf0f1", textDecoration: "none", margin: "0 10px" }}>Terms of Service</a>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
