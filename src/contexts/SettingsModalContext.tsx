/**
 * @file SettingsModalContext.tsx
 * @description ⚙️ Global settings modal state management
 * 
 * This context controls the visibility of the settings modal from anywhere in the app.
 * It provides a simple open/close API that can be triggered by:
 *   - Settings button in the controls bar
 *   - Keyboard shortcuts (if implemented)
 *   - Any settings-related interaction
 * 
 * 🔧 How it works:
 *   1. Context holds a simple boolean `isOpen` state
 *   2. `openModal()` sets isOpen to true
 *   3. `closeModal()` sets isOpen to false
 *   4. SettingsModal component consumes this context to show/hide itself
 * 
 * @functions
 *   → SettingsModalProvider → Context provider wrapping the app
 *   → useSettingsModal → Hook to access modal state and controls
 * 
 * @exports SettingsModalProvider, useSettingsModal
 * 
 * @see ./components/SettingsModal/SettingsModal.tsx - The modal component
 */

import { createContext, useContext, useState, ReactNode } from "react";

// 📖 Context value shape
interface SettingsModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const SettingsModalContext = createContext<SettingsModalContextType | undefined>(undefined);

/**
 * 📖 Settings Modal Provider Component
 * Wraps the app and provides modal state to all children.
 * 
 * @param children - React children to wrap
 */
export function SettingsModalProvider({ children }: { children: ReactNode }) {
  // 📖 Modal starts closed by default
  const [isOpen, setIsOpen] = useState(false);

  // 📖 Open the settings modal
  const openModal = () => setIsOpen(true);
  
  // 📖 Close the settings modal
  const closeModal = () => setIsOpen(false);

  return (
    <SettingsModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </SettingsModalContext.Provider>
  );
}

/**
 * 📖 useSettingsModal Hook
 * Access modal state and open/close functions from any component.
 * Must be used within a SettingsModalProvider.
 * 
 * @returns {SettingsModalContextType} - { isOpen, openModal, closeModal }
 * @throws Error if used outside SettingsModalProvider
 */
export function useSettingsModal() {
  const context = useContext(SettingsModalContext);
  if (context === undefined) {
    throw new Error("useSettingsModal must be used within a SettingsModalProvider");
  }
  return context;
}
