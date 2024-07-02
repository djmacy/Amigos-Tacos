// Footer.js
import React from 'react';
import './Footer.css';
//import fbLogo from "../images/fbLogo.png";
import instaLogo from "../images/instaNew.png";

const Footer = () => {
    return (
        <footer className="footer-container">
            <p>&copy; {new Date().getFullYear()} Amigos Tacos LLC. All rights reserved.</p>
            <p>Powered by <a href="mailto:macydavid2001@gmail.com">David Macy</a></p>
            <div className="social-media-icons">
                { /*<a href="https://www.facebook.com/cucinadimonica/" target="_blank" rel="noopener noreferrer">
                    <img src={fbLogo} alt="Facebook" />
                </a>*/}
                <a href="https://www.instagram.com/amigostacosmt/" target="_blank" rel="noopener noreferrer">
                    <img src={instaLogo} alt="Instagram" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;