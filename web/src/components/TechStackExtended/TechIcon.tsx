import { useEffect, useState } from "react";
import { techIconMapping } from "./techIconMapping";
import "./TechIcon.css";

interface TechIconProps {
    techName: string;
    size?: number;
}

/**
 * TechIcon component displays SVG logos from simple-icons
 * with original brand colors and fallback handling
 */
const TechIcon = ({ techName, size = 24 }: TechIconProps) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadIcon = async () => {
            const slug = techIconMapping[techName];

            if (!slug) {
                setError(true);
                return;
            }

            try {
                // Dynamically import the icon from simple-icons using the JS API
                const iconModule = await import(`simple-icons`);

                // Convert slug to the correct format (e.g., "javascript" -> "siJavascript")
                const iconKey = `si${slug.charAt(0).toUpperCase()}${slug.slice(1).replace(/-/g, '')}`;

                // Get the icon from the module
                const icon = (iconModule as any)[iconKey];

                if (icon && icon.svg && icon.hex) {
                    // Replace the fill color with the original brand color
                    const coloredSvg = icon.svg.replace(
                        /fill="[^"]*"/g,
                        `fill="#${icon.hex}"`
                    ).replace(
                        /<svg/,
                        `<svg fill="#${icon.hex}"`
                    );
                    setSvgContent(coloredSvg);
                } else {
                    console.warn(`Icon not found for ${techName} (key: ${iconKey})`);
                    setError(true);
                }
            } catch (err) {
                console.warn(`Failed to load icon for ${techName} (slug: ${slug})`, err);
                setError(true);
            }
        };

        loadIcon();
    }, [techName]);

    if (error || !svgContent) {
        // Fallback: display a generic icon with a gradient
        return (
            <div className="tech-icon-fallback" style={{ width: size, height: size }}>
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="fallback-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                        </linearGradient>
                    </defs>
                    <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                        stroke="url(#fallback-gradient)"
                        strokeWidth="2"
                        fill="none"
                    />
                    <line x1="9" y1="9" x2="15" y2="15" stroke="url(#fallback-gradient)" strokeWidth="2" />
                    <line x1="15" y1="9" x2="9" y2="15" stroke="url(#fallback-gradient)" strokeWidth="2" />
                </svg>
            </div>
        );
    }

    return (
        <div
            className="tech-icon tech-icon-colored"
            style={{ width: size, height: size }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};

export default TechIcon;
