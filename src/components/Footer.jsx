import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">
          <h3>SLAY</h3>
          <p>Делаем ваши тренировки лучше и эффективнее.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about-us">About us</a>
            </li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: reixter@bk.ru</p>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <a href="/">
            <img
              src="/telegram-icon.png"
              alt="img"
            />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 Slay.</p>
      </div>
    </footer>
  );
};

export default Footer;
