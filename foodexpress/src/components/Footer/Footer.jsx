import React from "react";
import "./Footer.css"; // Import the CSS file
import fb from "../../assets/icons/fb.png";
import insta from "../../assets/icons/insta.png";
import twitter from "../../assets/icons/twitter.png";
import logo from "../../assets/images/logo.png"
import logo_back from "../../assets/images/logo_back.png"
// --- Social Media SVG Icons ---
/*const FacebookIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
  </svg>
);
const InstagramIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M12 2C8.7 2 8.3 2.02 7.8 2.05c-1.8.12-3.1.5-4.1 1.05C2.7 3.6 2 4.3 1.45 5.35c-.55 1-.93 2.3-1.05 4.1C.02 9.7 0 10.1 0 13.3c0 3.2.02 3.6.05 4.1c.12 1.8.5 3.1 1.05 4.1c.5.95 1.2 1.65 2.15 2.15c1 .55 2.3.93 4.1 1.05c.5.03.9.05 4.1.05s3.6-.02 4.1-.05c1.8-.12 3.1-.5 4.1-1.05c.95-.5 1.65-1.2 2.15-2.15c.55-1 .93-2.3 1.05-4.1c.03-.5.05-.9.05-4.1s-.02-3.6-.05-4.1c-.12-1.8-.5-3.1-1.05-4.1c-.5-.95-1.2-1.65-2.15-2.15c-1-.55-2.3-.93-4.1-1.05C15.6.02 15.2 0 12 0zm0 3c3.1 0 3.5.01 4.7.07c1.2.05 2.1.25 2.8.55c.8.35 1.4.75 2 1.35c.6.6 1 1.2 1.35 2c.3.7.5 1.6.55 2.8c.06 1.2.07 1.6.07 4.7s-.01 3.5-.07 4.7c-.05 1.2-.25 2.1-.55 2.8c-.35.8-.75 1.4-1.35 2c-.6.6-1.2 1-2 1.35c-.7.3-1.6.5-2.8.55c-1.2.06-1.6.07-4.7.07s-3.5-.01-4.7-.07c-1.2-.05-2.1-.25-2.8-.55c-.8-.35-1.4-.75-2-1.35c-.6-.6-1-1.2-1.35-2c-.3-.7-.5-1.6-.55-2.8C3.01 15.5 3 15.1 3 12s.01-3.5.07-4.7c.05-1.2.25 2.1.55 2.8c.35-.8.75-1.4 1.35-2c.6-.6 1.2-1 2-1.35c.7-.3 1.6-.5 2.8-.55C8.5 3.01 8.9 3 12 3zm0 4c-2.75 0-5 2.25-5 5s2.25 5 5 5s5-2.25 5-5s-2.25-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3s3 1.35 3 3s-1.35 3-3 3zm6.5-8.75c-.7 0-1.25.55-1.25 1.25s.55 1.25 1.25 1.25s1.25-.55 1.25-1.25s-.55-1.25-1.25-1.25z" />
  </svg>
);
const TwitterIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M22.46 6c-.77.35-1.6.58-2.46.67c.88-.53 1.56-1.37 1.88-2.38c-.83.49-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.27c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.4 6.16 2.4 6.94c0 1.48.75 2.79 1.9 3.56c-.7-.02-1.36-.21-1.94-.53v.05c0 2.07 1.47 3.8 3.42 4.19c-.36.1-.74.15-1.13.15c-.27 0-.54-.03-.8-.08c.54 1.7 2.1 2.94 3.97 2.97c-1.45 1.14-3.29 1.82-5.29 1.82c-.34 0-.68-.02-1.01-.06C2.9 19.5 5.03 20 7.3 20c8.77 0 13.57-7.27 13.57-13.57c0-.21 0-.41-.02-.62c.93-.67 1.73-1.51 2.37-2.37z" />
  </svg>
);*/


const Footer = () => {
  const Logo = "https://i.imgur.com/g833v2P.png"; // Placeholder logo

  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        {/* --- Column 1: Logo and Slogan --- */}
        <div className="footer-column footer-about">
            {/* *** Using placeholder logo *** */}
            <img src={logo_back} alt="FoodExpress Logo" className="footer-logo-img" />
            <p>Your favorite food, delivered fast.</p>
          </div>
        {/*<div className="footer-column footer-about">
          <div className="footer-logo-text">FoodExpress</div>
          <p>Your favorite food, delivered fast.</p>
        </div>*/}

        {/* --- Column 2: Quick Links --- */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="#offers">Offers</a>
            </li>
            <li>
              <a href="#menu">Menu</a>
            </li>
            <li>
              <a href="#">My Account</a>
            </li>
            <li>
              <a href="#">Track Order</a>
            </li>
          </ul>
        </div>

        {/* --- Column 3: Support --- */}
        <div className="footer-column">
          <h4>Support</h4>
          <ul className="footer-links">
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
          </ul>
        </div>

        {/* --- Column 4: Social Media --- */}
        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook">
              <img src={fb} alt="Facebook" className="social-icon-img" />
              {/*<FacebookIcon />*/}
         
            
            </a>
            <a href="#" aria-label="Instagram">
              <img src={insta} alt="Instagram" className="social-icon-img" />
              {/*<InstagramIcon />*/}
            </a>
            <a href="#" aria-label="Twitter">
              <img src={twitter} alt="Twitter" className="social-icon-img" />
              {/*<TwitterIcon />*/}
            </a>
          </div>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="footer-bottom">
        <p>&copy; 2025 FoodExpress. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
