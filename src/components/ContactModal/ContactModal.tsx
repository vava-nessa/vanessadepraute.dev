import { useState } from "react"; // Removed unused useEffect
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, Mail, Send } from "lucide-react";
import { FaWhatsapp, FaLinkedin, FaGithub } from "react-icons/fa";
import { useContactModal } from "@/contexts/ContactModalContext";

export default function ContactModal() {
    const { isOpen, closeModal } = useContactModal();
    const { t } = useTranslation();
    const [formState, setFormState] = useState<"idle" | "sending" | "sent">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState("sending");

        // Simulate sending
        setTimeout(() => {
            setFormState("sent");
            setTimeout(() => {
                setFormState("idle");
                closeModal();
            }, 5000);
        }, 1500);
    };

    const socialLinks = [
        {
            icon: <FaWhatsapp size={24} />,
            href: "https://wa.me/33661666397",
            label: "WhatsApp",
            color: "hover:text-green-400"
        },
        {
            icon: <Mail size={24} />,
            href: "mailto:vanessadepraute@gmail.com",
            label: "Email",
            color: "hover:text-blue-400"
        },
        {
            icon: <FaLinkedin size={24} />,
            href: "https://www.linkedin.com/in/vanessa-depraute-310b801ba/",
            label: "LinkedIn",
            color: "hover:text-blue-600"
        },
        {
            icon: <FaGithub size={24} />,
            href: "https://github.com/vava-nessa",
            label: "GitHub",
            color: "hover:text-purple-500"
        }
    ];

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
                            <h2 className="mb-2 text-3xl font-bold text-white tracking-tight">
                                {t("contactModal.title")}
                            </h2>
                            <p className="text-white/60">{t("contactModal.subtitle")}</p>
                        </div>

                        {/* Social Links Row */}
                        <div className="mb-8 flex justify-center gap-6">
                            {socialLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-white/70 transition-all hover:scale-110 ${link.color}`}
                                    title={link.label}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>

                        <div className="mb-8 flex items-center gap-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-sm text-white/40">{t("contactModal.socials")}</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder={t("contactModal.namePlaceholder")}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-brand-primary/50 focus:bg-white/10"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder={t("contactModal.emailPlaceholder")}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-brand-primary/50 focus:bg-white/10"
                                    required
                                />
                            </div>
                            <div>
                                <textarea
                                    rows={4}
                                    placeholder={t("contactModal.messagePlaceholder")}
                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-brand-primary/50 focus:bg-white/10"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={formState !== "idle"}
                                className={`group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition-all 
                  ${formState === "sent"
                                        ? "bg-green-500/80 hover:bg-green-500"
                                        : "bg-gradient-to-r from-brand-primary to-purple-600 hover:opacity-90 active:scale-[0.98]"
                                    }`}
                            >
                                {formState === "idle" && (
                                    <>
                                        {t("contactModal.sendButton")}
                                        <Send size={18} className="transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                                {formState === "sending" && t("contactModal.sending")}
                                {formState === "sent" && t("contactModal.sent")}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
