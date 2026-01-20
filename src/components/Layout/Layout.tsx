import { ReactNode } from 'react';
import GradualBlur from '../ui/GradualBlur/GradualBlur';
import ContactModal from '../ContactModal/ContactModal';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {children}
      <ContactModal />
      <GradualBlur
        strength={1}
        divCount={6}
        target="page"
        opacity={1}
      />
    </>
  );
};

export default Layout;
