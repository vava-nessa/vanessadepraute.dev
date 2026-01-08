import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Glitchy404 } from "../components/ui/glitchy-404-1";
import { useTheme } from "../contexts/ThemeContext";
import "../App.css";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/${i18n.language}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, i18n.language]);

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden flex flex-col items-center justify-center gap-8 p-4">
      <Glitchy404
        width={800}
        height={232}
        color={theme === "dark" ? "#fff" : "#1f1f1f"}
      />

      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-300">
          {t("notFound.title")}
        </h2>
        <p className="text-lg md:text-xl text-neutral-400">
          {t("notFound.description")}
        </p>
        <p className="text-md text-neutral-500">
          {t("notFound.redirect", { seconds: countdown })}
        </p>
      </div>
    </div>
  );
}
