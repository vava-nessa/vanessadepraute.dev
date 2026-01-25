import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../App.css";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to root for English, /fr for French
          const redirectPath = i18n.language === "fr" ? "/fr" : "/";
          navigate(redirectPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, i18n.language]);

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden flex flex-col items-center justify-center gap-12 p-4">
      {/* Profile Picture */}
      <div className="relative">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-violet-500 overflow-hidden shadow-2xl shadow-violet-500/50">
          <img
            src="/avatar.png"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Speech Bubble */}
      <div className="relative max-w-md">
        {/* Bubble tail pointing up */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-violet-500/20"></div>

        {/* Bubble content */}
        <div className="relative bg-gradient-to-br from-violet-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-violet-500/50 rounded-3xl px-8 py-6 shadow-2xl shadow-violet-500/30">
          <p className="text-xl md:text-2xl text-center font-medium text-white leading-relaxed">
            I'm sorry but... the page you're looking for doesn't exist...
          </p>
        </div>
      </div>

      {/* 404 Number */}
      <div className="relative">
        <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-violet-500 via-pink-500 to-violet-500 bg-clip-text text-transparent animate-pulse">
          404
        </h1>
        <div className="absolute inset-0 text-9xl md:text-[12rem] font-black text-violet-500/20 blur-2xl">
          404
        </div>
      </div>

      {/* Redirect message */}
      <p className="text-md text-neutral-400 text-center">
        Redirecting to home in {countdown} second{countdown !== 1 ? 's' : ''}...
      </p>
    </div>
  );
}
