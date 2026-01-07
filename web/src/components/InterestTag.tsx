import React from "react";

interface InterestTagProps {
    label: string;
    emoji: string;
}

const InterestTag: React.FC<InterestTagProps> = ({ label, emoji }) => {
    return (
        <div className="group flex items-center rounded-full border border-neutral-800 bg-neutral-900/30 overflow-hidden hover:border-violet-500/50 transition-all duration-300 cursor-default backdrop-blur-sm shadow-sm hover:shadow-violet-500/5">
            <div className="px-2.5 py-1.5 bg-black/60 flex items-center justify-center border-r border-neutral-800 group-hover:border-violet-500/30 transition-colors">
                <span className="text-sm md:text-base leading-none">{emoji}</span>
            </div>
            <div className="px-3.5 py-1.5">
                <span className="text-neutral-400 text-sm md:text-base group-hover:text-white transition-colors lowercase whitespace-nowrap font-medium">
                    {label}
                </span>
            </div>
        </div>
    );
};

export default InterestTag;
