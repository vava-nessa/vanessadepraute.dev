/**
 * @file ContactModalContext.tsx
 * @description 📧 Global contact modal state management
 * 
 * This context controls the visibility of the contact modal from anywhere in the app.
 * It provides a simple open/close API that can be triggered by:
 *   - Contact buttons
 *   - CTA elements
 *   - Keyboard shortcuts (if implemented)
 * 
 * 🔧 How it works:
 *   1. Context holds a simple boolean `isOpen` state
 *   2. `openModal()` sets isOpen to true
 *   3. `closeModal()` sets isOpen to false
 *   4. ContactModal component consumes this context to show/hide itself
 * 
 * @functions
 *   → ContactModalProvider → Context provider wrapping the app
 *   → useContactModal → Hook to access modal state and controls
 * 
 * @exports ContactModalProvider, useContactModal
 * 
 * @see ./components/ContactModal/ContactModal.tsx - The modal component
 * @see ./components/ContactButton.tsx - Button that triggers the modal
 */

import { createContext, useContext, useState, ReactNode } from "react";

// 📖 Context value shape
interface ContactModalContextType {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

/**
 * 📖 Contact Modal Provider Component
 * Wraps the app and provides modal state to all children.
 * 
 * @param children - React children to wrap
 */
export function ContactModalProvider({ children }: { children: ReactNode }) {
    // 📖 Modal starts closed by default
    const [isOpen, setIsOpen] = useState(false);

    // 📖 Open the contact modal
    const openModal = () => setIsOpen(true);
    
    // 📖 Close the contact modal
    const closeModal = () => setIsOpen(false);

    return (
        <ContactModalContext.Provider value={{ isOpen, openModal, closeModal }}>
            {children}
        </ContactModalContext.Provider>
    );
}

/**
 * 📖 useContactModal Hook
 * Access modal state and open/close functions from any component.
 * Must be used within a ContactModalProvider.
 * 
 * @returns {ContactModalContextType} - { isOpen, openModal, closeModal }
 * @throws Error if used outside ContactModalProvider
 */
export function useContactModal() {
    const context = useContext(ContactModalContext);
    if (context === undefined) {
        throw new Error("useContactModal must be used within a ContactModalProvider");
    }
    return context;
}
