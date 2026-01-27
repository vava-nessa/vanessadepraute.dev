/**
 * @file Footer.tsx
 * @description Site footer with social links and build timestamp.
 * @functions
 *   → formatBuildDate: Formats the build date based on locale (en/fr)
 * @exports Footer component
 * @see vite.config.ts for BUILD_DATE injection
 *
 * 📖 The "Last update" text helps SEO by showing Google the site is actively maintained.
 * The date is set at build time via Vite's define option, ensuring it updates on every deploy.
 */
import { Linkedin, Github, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './Footer.css';

/**
 * 📖 Formats the build date for display based on locale.
 * - English: "January 27, 2026 at 3:45 PM"
 * - French: "27 janvier 2026 à 15h45"
 */
function formatBuildDate(isoString: string, locale: string): string {
  const date = new Date(isoString);

  if (locale === 'fr') {
    // 📖 French format: "27 janvier 2026 à 15h45"
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }) + ' à ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).replace(':', 'h');
  }

  // 📖 English format: "January 27, 2026 at 3:45 PM"
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const Footer = () => {
  const { i18n, t } = useTranslation();
  const formattedDate = formatBuildDate(BUILD_DATE, i18n.language);

  return (
    <footer className="footer">
      <div className="footer-icons">
        <a
          href="https://www.linkedin.com/in/vanessa-depraute-310b801ba/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon-link"
          aria-label="LinkedIn"
        >
          <Linkedin size={50} />
          <span className="footer-icon-label">LINKEDIN</span>
        </a>
        <a
          href="https://github.com/vavanesssa"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon-link"
          aria-label="GitHub"
        >
          <Github size={50} />
          <span className="footer-icon-label">GITHUB</span>
        </a>
        <a
          href="https://wa.me/33661666397"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-icon-link"
          aria-label="WhatsApp"
        >
          <FaWhatsapp size={50} />
          <span className="footer-icon-label">WHATSAPP</span>
        </a>
        <a
          href="mailto:vanessadepraute@gmail.com"
          className="footer-icon-link"
          aria-label="Email"
        >
          <Mail size={50} />
          <span className="footer-icon-label">EMAIL</span>
        </a>
      </div>

      {/* 📖 Discrete "Last update" text for SEO - shows Google the site is actively maintained */}
      <div className="footer-last-update">
        {t('footer.lastUpdate')}: {formattedDate}
      </div>
    </footer>
  );
};

export default Footer;
