import { ReactNode } from 'react';
import './ControlsBar.css';

interface ControlsBarProps {
  children: ReactNode;
}

const ControlsBar = ({ children }: ControlsBarProps) => {
  return (
    <div className="controls-bar">
      {children}
    </div>
  );
};

export default ControlsBar;
