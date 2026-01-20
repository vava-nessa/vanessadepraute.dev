import { ReactNode, useState, useEffect, useRef } from 'react';
import './ControlsBar.css';

interface ControlsBarProps {
  children: ReactNode;
}

const ControlsBar = ({ children }: ControlsBarProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show if scrolling up or at the very top
      if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        // Hide if scrolling down and not at the top
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`controls-bar ${!isVisible ? 'hidden' : ''}`}>
      {children}
    </div>
  );
};

export default ControlsBar;
