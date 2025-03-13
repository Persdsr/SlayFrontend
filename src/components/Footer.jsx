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
          <h4>Дополнительно</h4>
          <ul>
            <li>
              <a href={'/oferta'} className="footer-link">License agreement</a>
            </li>
            <li>
              <a href={'/oferta'} className="footer-link">Contacts</a>
            </li>
            <li>
              <a href={'/about'} className="footer-link">About us</a>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
          <li>
              <a className="footer-link" href="/">Home</a>
            </li>
            <li>
              <a className="footer-link" href="/courses">Course catalog</a>
            </li>
          </ul>
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
    </footer>
  );
};

export default Footer;
