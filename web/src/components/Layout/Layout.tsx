import { ReactNode } from 'react';
import GradualBlur from '../ui/GradualBlur/GradualBlur';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      {children}
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
