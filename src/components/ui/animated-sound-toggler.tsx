"use client"

import { useState, useCallback } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import "./animated-sound-toggler.css"

type AnimatedSoundTogglerProps = {
    className?: string
}

export const AnimatedSoundToggler = ({ className }: AnimatedSoundTogglerProps) => {
    const [isMuted, setIsMuted] = useState(false)
    const { t } = useTranslation()

    const onToggle = useCallback(() => {
        setIsMuted((prev) => !prev)
        // Here you can add sound functionality in the future
        // For now, it's just UI
    }, [])

    return (
        <button
            onClick={onToggle}
            aria-label={isMuted ? t("sound.unmute") : t("sound.mute")}
            title={isMuted ? t("sound.unmute") : t("sound.mute")}
            className={cn(
                "animated-sound-toggler flex items-center justify-center outline-none focus:outline-none active:outline-none focus:ring-0 cursor-pointer",
                className
            )}
            type="button"
        >
            <AnimatePresence mode="wait" initial={false}>
                {isMuted ? (
                    <motion.span
                        key="muted-icon"
                        initial={{ opacity: 0, scale: 0.55, rotate: -25 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.165 }}
                        className="text-brand-primary"
                    >
                        <VolumeX size={24} />
                    </motion.span>
                ) : (
                    <motion.span
                        key="unmuted-icon"
                        initial={{ opacity: 0, scale: 0.55, rotate: 25 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.165 }}
                        className="text-brand-primary"
                    >
                        <Volume2 size={24} />
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    )
}
