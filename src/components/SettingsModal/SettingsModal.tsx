/**
 * @file SettingsModal.tsx
 * @description ⚙️ Settings modal with theme toggle and other preferences
 * 
 * This modal provides a centralized location for user settings:
 * - Theme toggle (dark/light mode)
 * - Future: Language preferences
 * - Future: Accessibility options
 * 
 * 🎨 Styled similarly to ContactModal for consistency
 * 
 * @functions
 *   → SettingsModal → Modal component with settings options
 * 
 * @exports SettingsModal
 * 
 * @see ../contexts/SettingsModalContext.tsx - Modal state management
 * @see ../contexts/ThemeContext.tsx - Theme toggle functionality
 * @see ../components/ui/animated-theme-toggler.tsx - Theme toggle button
 */

// import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, Settings as SettingsIcon } from "lucide-react";
import { useSettingsModal } from "@/contexts/SettingsModalContext";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

export default function SettingsModal() {
  const { isOpen, closeModal } = useSettingsModal();
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white/10 p-8 shadow-2xl backdrop-blur-xl border border-white/20"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <SettingsIcon size={48} className="text-brand-primary" />
              </div>
              <h2 className="mb-2 text-3xl font-bold text-white tracking-tight">
                {t("settings.title", { defaultValue: "Settings" })}
              </h2>
              <p className="text-white/60">{t("settings.subtitle", { defaultValue: "Customize your experience" })}</p>
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">
              {/* Theme Section */}
              <div className="rounded-2xl bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {t("settings.theme.title", { defaultValue: "Theme" })}
                    </h3>
                    <p className="text-sm text-white/60">
                      {t("settings.theme.description", { defaultValue: "Switch between light and dark mode" })}
                    </p>
                  </div>
                  <AnimatedThemeToggler />
                </div>
              </div>

              {/* Future settings can be added here */}
              {/* 
              <div className="rounded-2xl bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      Language
                    </h3>
                    <p className="text-sm text-white/60">
                      Choose your preferred language
                    </p>
                  </div>
                  <LanguageSwitcher />
                </div>
              </div>
              */}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
