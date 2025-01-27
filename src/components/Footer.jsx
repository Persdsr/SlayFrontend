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
                        <li><a href="/">Домой</a></li>
                        <li><a href="/">О нас</a></li>
                        <li><a href="/">Сервисы</a></li>
                        <li><a href="/">Контакты</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h4>Contact Us</h4>
                    <p>Email: support@company.com</p>
                    <p>Phone: +123-456-7890</p>
                    <p>Address: 123 Business Road, City, Country</p>
                </div>

                <div className="footer-social">
                    <h4>Follow Us</h4>
                    <a href="/"><img src="https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png" alt="img"/></a>
                    <a href="/"><img src="https://img.icons8.com/ios-filled/50/ffffff/twitter.png" alt="img"/></a>
                    <a href="/"><img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="img"/></a>
                    <a href="/"><img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="img"/></a>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2024 Slay.</p>
            </div>
        </footer>
    );
};

export default Footer;