/**
 * @file Layout.tsx
 * @description Main layout wrapper that includes global UI elements (blur effect, contact modal).
 * @functions
 *   → useScrollFadeOpacity: Custom hook that calculates blur opacity based on scroll position
 * @exports Layout component
 * @see GradualBlur for the blur effect component
 *
 * 📖 The GradualBlur effect fades out progressively when approaching the bottom of the page.
 * This creates a smoother experience and reveals the footer content without the blur overlay.
 */
import { ReactNode, useState, useEffect, useCallback } from 'react';
import GradualBlur from '../ui/GradualBlur/GradualBlur';
import ContactModal from '../ContactModal/ContactModal';

interface LayoutProps {
  children: ReactNode;
}

/**
 * 📖 Custom hook that calculates the blur opacity based on scroll position.
 * When user scrolls near the bottom of the page, opacity fades from 1 to 0.
 * @param fadeStartDistance - Distance from bottom (in px) where fade starts (default: 400px)
 * @param fadeEndDistance - Distance from bottom (in px) where opacity reaches 0 (default: 100px)
 */
function useScrollFadeOpacity(fadeStartDistance = 400, fadeEndDistance = 100): number {
  const [opacity, setOpacity] = useState(1);

  const handleScroll = useCallback(() => {
    // 📖 Calculate how far we are from the bottom of the page
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    // 📖 Calculate opacity based on distance from bottom
    // Full opacity when far from bottom, fades to 0 as we approach
    if (distanceFromBottom >= fadeStartDistance) {
      setOpacity(1);
    } else if (distanceFromBottom <= fadeEndDistance) {
      setOpacity(0);
    } else {
      // 📖 Linear interpolation between fadeStart and fadeEnd
      const fadeRange = fadeStartDistance - fadeEndDistance;
      const fadeProgress = (distanceFromBottom - fadeEndDistance) / fadeRange;
      setOpacity(fadeProgress);
    }
  }, [fadeStartDistance, fadeEndDistance]);

  useEffect(() => {
    // 📖 Initial calculation
    handleScroll();

    // 📖 Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  return opacity;
}

const Layout = ({ children }: LayoutProps) => {
  // 📖 Blur fades out starting 400px from bottom, fully gone at 100px from bottom
  const blurOpacity = useScrollFadeOpacity(400, 100);

  return (
    <>
      {children}
      <ContactModal />
      <GradualBlur
        strength={1}
        divCount={6}
        target="page"
        opacity={blurOpacity}
      />
    </>
  );
};

export default Layout;
