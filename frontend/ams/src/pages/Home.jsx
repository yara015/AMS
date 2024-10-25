import { alignProperty } from "@mui/material/styles/cssUtils";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let slideIndex = 0;
    const slides = document.querySelector('.slide-wrapper');
    const slideItems = document.querySelectorAll('.mySlides');
    let autoSlideInterval;
  
    function showSlides() {
      slideIndex++;
      if (slideIndex >= slideItems.length) {
        slideIndex = 0;
      }
      updateSlides();
    }
  
    function plusSlides(n) {
      slideIndex += n;
      if (slideIndex >= slideItems.length) {
        slideIndex = 0;
      } else if (slideIndex < 0) {
        slideIndex = slideItems.length - 1;
      }
      updateSlides();
      restartAutoSlide(); // Restart auto slide when user manually clicks
    }
  
    function updateSlides() {
      slides.style.transform = 'translateX(' + (-slideIndex * 100) + '%)';
    }
  
    function startAutoSlide() {
      autoSlideInterval = setInterval(showSlides, 5000); // Auto slide every 5 seconds
    }
  
    function restartAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide(); // Restart automatic sliding after manual navigation
    }
  
    document.querySelector('.prev').addEventListener('click', () => plusSlides(-1));
    document.querySelector('.next').addEventListener('click', () => plusSlides(1));
  
    startAutoSlide(); // Start auto slideshow
  
    return () => {
      clearInterval(autoSlideInterval); // Cleanup on unmount
    };
  }, []);
  

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#2b3844", margin: "0", padding: "0", overflowX: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
    
      {/* Top Buttons
      <div style={{ background: "#2b3844", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "1rem", position: "fixed", top: "0", width: "100%", zIndex: "10" }}>
      <h1 style={{marginRight:"20rem", color:"white" ,lineHeight:"1rem"}}>Hitech Apartments</h1>
        <button
          onClick={() => navigate('/login')}
          style={{ backgroundColor: "#2980b9", color: "#ecf0f1", padding: "0.5rem 1rem", border: "none", borderRadius: "5px", marginRight: "1rem", cursor: "pointer", fontWeight: "bold" }}
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          style={{ backgroundColor: "#27ae60", color: "#ecf0f1", padding: "0.5rem 1rem", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
        >
          Register
        </button>
      </div> */}

      {/* Spacer for Top Buttons */}
      <div style={{ height: "4rem" }}></div> {/* Spacer div ensures that content is pushed below the fixed header */}

 {/* Hero Section with About Us */}
 {/* <div className="hero-section" style={{ position: "relative", width: "100%", marginTop: "40%", height: "calc(100vh - 4rem)", backgroundImage: "url('../images/GatedComm.jpg')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", zIndex: "5" }}>
        <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", background: "linear-gradient(to left, rgba(43, 56, 68, 0), #2b3844)", zIndex: "1" }}></div>
        <div className="content-left" style={{ right:"20%",position: "relative", padding: "2rem", borderRadius: "10px", zIndex: "2", maxWidth: "50%", color: "#ffffff", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)", fontSize: "1.2rem", background: "rgba(0, 0, 0, 0.5)" }}>
          <h2 style={{ fontSize: "2rem" }}>About Us</h2>
          <p style={{justifyContent:'left'}}>Welcome to our premier apartment community, where excellence meets elegance. Our apartments are designed with you in mind, offering the perfect balance of luxury and practicality. Each unit features stunning layouts, high-end finishes, and breathtaking views, ensuring you experience the best in apartment living.</p>
          <p>Enjoy an array of top-tier amenities, from state-of-the-art fitness centers to beautifully landscaped courtyards, all curated to enhance your lifestyle. Located in vibrant neighborhoods, our apartments offer the ideal combination of convenience and tranquility. Join us and elevate your living experience to new heights.</p>
        </div>
      </div> */}
      <div className="hero-section" style={{ position: "relative", width: "100%", marginTop: "40%", height: "calc(100vh - 4rem)", backgroundImage: "url('../images/GatedComm.jpg')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", zIndex: "5" }}>
  <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", background: "linear-gradient(to left, rgba(43, 56, 68, 0), #2b3844)", zIndex: "1" }}></div>
  <div className="content-left" style={{ right: "10%", position: "relative", padding: "2rem", borderRadius: "10px", zIndex: "2", maxWidth: "50%", color: "#ffffff", textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)", fontSize: "1.2rem", background: "rgba(0, 0, 0, 0.5)" }}>
    <h2 style={{ fontSize: "2rem" }}>About Us</h2>
    <p style={{ justifyContent: 'left' }}>Welcome to our premier apartment community, where excellence meets elegance. Our apartments are designed with you in mind, offering the perfect balance of luxury and practicality. Each unit features stunning layouts, high-end finishes, and breathtaking views, ensuring you experience the best in apartment living.</p>
    <p>Enjoy an array of top-tier amenities, from state-of-the-art fitness centers to beautifully landscaped courtyards, all curated to enhance your lifestyle. Located in vibrant neighborhoods, our apartments offer the ideal combination of convenience and tranquility. Join us and elevate your living experience to new heights.</p>
  </div>
</div>

<style>{`
@media (max-width: 768px) {
  .hero-section {
    height: auto;
    margin-top: 20%;
  }

  .content-left {
    max-width: 80%;
    padding: 1.5rem;
    font-size: 1rem;
    right: 5%;
  }

  .hero-section h2 {
    font-size: 1.5rem;
  }

  .hero-section p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: auto;
    margin-top: 10%;
  }

  .content-left {
    max-width: 90%;
    padding: 1rem;
    font-size: 0.9rem;
    right: 2%;
  }

  .hero-section h2 {
    font-size: 1.2rem;
  }

  .hero-section p {
    font-size: 0.8rem;
  }
}
`}</style>


      {/* Slideshow Section */}
      <div className="slideshow-container" style={{ position: "relative", maxWidth: "100%", margin: "2rem auto", overflow: "hidden", zIndex: "1" }}>
        <div className="slide-wrapper" style={{ display: "flex", transition: "transform 1s ease" }}>
          <div className="mySlides" style={{ flex: "1 0 100%", height: "70vh", backgroundImage: "url('images/Hall_Cyber.avif')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end" }}>
            <div className="slide-content" style={{ background: "rgba(0, 0, 0, 0.5)", color: "#ffffff", padding: "1rem", borderRadius: "10px", maxWidth: "80%", margin: "1rem" }}>
              <h2 style={{ fontSize: "1.5rem" }}>Modern Themed Rooms</h2>
              <p>Experience the contemporary elegance of our modern themed rooms.</p>
            </div>
          </div>
          <div className="mySlides" style={{ flex: "1 0 100%", height: "70vh", backgroundImage: "url('images/gym_rat.webp')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end" }}>
            <div className="slide-content" style={{ background: "rgba(0, 0, 0, 0.5)", color: "#ffffff", padding: "1rem", borderRadius: "10px", maxWidth: "80%", margin: "1rem" }}>
              <h2 style={{ fontSize: "1.5rem" }}>State-of-the-Art Gyms</h2>
              <p>Stay fit and healthy with our fully equipped modern gyms.</p>
            </div>
          </div>
          <div className="mySlides" style={{ flex: "1 0 100%", height: "70vh", backgroundImage: "url('images/ki.webp')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end" }}>
            <div className="slide-content" style={{ background: "rgba(0, 0, 0, 0.5)", color: "#ffffff", padding: "1rem", borderRadius: "10px", maxWidth: "80%", margin: "1rem" }}>
              <h2 style={{ fontSize: "1.5rem" }}>Modern Kitchens</h2>
              <p>Cook and entertain in our stylish and fully-equipped modern kitchens.</p>
            </div>
          </div>
          <div className="mySlides" style={{ flex: "1 0 100%", height: "70vh", backgroundImage: "url('images/spacious_balcony.jpg')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "flex-end" }}>
            <div className="slide-content" style={{ background: "rgba(0, 0, 0, 0.5)", color: "#ffffff", padding: "1rem", borderRadius: "10px", maxWidth: "80%", margin: "1rem" }}>
              <h2 style={{ fontSize: "1.5rem" }}>Spacious Balconies</h2>
              <p>Relax and enjoy the view from our spacious balconies.</p>
            </div>
          </div>
        </div>
        <a className="prev" style={{ cursor: "pointer", position: "absolute", top: "50%", left: "0", padding: "0.5rem", color: "white", fontWeight: "bold", fontSize: "1.5rem", transition: "0.6s ease", borderRadius: "0 3px 3px 0", userSelect: "none", backgroundColor: "rgba(0,0,0,0.8)", zIndex: "5" }}>&#10094;</a>
        <a className="next" style={{ cursor: "pointer", position: "absolute", top: "50%", right: "0", padding: "0.5rem", color: "white", fontWeight: "bold", fontSize: "1.5rem", transition: "0.6s ease", borderRadius: "3px 0 0 3px", userSelect: "none", backgroundColor: "rgba(0,0,0,0.8)", zIndex: "5" }}>&#10095;</a>
      </div>

      {/* Footer */}
      {/* <div className="footer" style={{ background: "#2b3844", color: "#ecf0f1", textAlign: "center", padding: "1rem", marginTop: "auto", fontSize: "0.875rem", zIndex: "1", position: "relative" }}>
        <p>&copy; 2024 Apartment Management System. All Rights Reserved.</p>
        <p>
          <a href="#" style={{ color: "#ecf0f1", textDecoration: "none", margin: "0 0.5rem" }}>Contact Us</a> | 
          <a href="#" style={{ color: "#ecf0f1", textDecoration: "none", margin: "0 0.5rem" }}>Privacy Policy</a> | 
          <a href="#" style={{ color: "#ecf0f1", textDecoration: "none", margin: "0 0.5rem" }}>Terms of Service</a>
        </p>
      </div> */}
    </div>
  );
};

export default Home;
