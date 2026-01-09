import { Linkedin, Github, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-icons">
        <a
          href="https://google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon-link"
          aria-label="LinkedIn"
        >
          <Linkedin size={50} />
          <span className="footer-icon-label">LINKEDIN</span>
        </a>
        <a
          href="https://google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon-link"
          aria-label="GitHub"
        >
          <Github size={50} />
          <span className="footer-icon-label">GITHUB</span>
        </a>
        <a
          href="https://google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon-link"
          aria-label="WhatsApp"
        >
          <FaWhatsapp size={50} />
          <span className="footer-icon-label">WHATSAPP</span>
        </a>
        <a
          href="mailto:example@example.com"
          className="footer-icon-link"
          aria-label="Email"
        >
          <Mail size={50} />
          <span className="footer-icon-label">EMAIL</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
