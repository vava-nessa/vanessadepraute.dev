import { useEffect, useState } from "react";
import { techIconMapping } from "./techIconMapping";
import "./TechIcon.css";

interface TechIconProps {
    techName: string;
    size?: number;
}

// Custom icons that we host locally
const customIcons: Record<string, string> = {
    "openai": "/icons/openai.svg",
    "playwright": "/icons/playwright.png",
    "adobe": "/icons/adobe.svg",
    "illustrator": "/icons/illustrator.svg",
    "photoshop": "/icons/photoshop.svg",
    "zustand": "/icons/zustand.png",
    "jotai": "/icons/jotai.png",
    "deepseek": "/icons/deepseek.png",
    "cohere": "/icons/cohere.png",
    "groq": "/icons/groq.svg",
    "togetherdotai": "/icons/together-ai.png",
    "pinecone": "/icons/pinecone.png",
    "weaviate": "/icons/weaviate.png",
    "codeium": "/icons/codeium.png",
    "stabilityai": "/icons/stability-ai.png",
    "llamaindex": "/icons/llamaindex.png",
    "sourcegraph": "/icons/cody.svg",
    "x": "/icons/xai.png",
    "continue": "/icons/continue.png",
    "qdrant": "/icons/qdrant.svg",
    "amazonaws": "/icons/aws.svg",
    "atomicdesign": "/icons/atomic-design.png",
    "phi": "/icons/phi.png",
    "woocommerce": "/icons/adobe-commerce.svg",
};

/**
 * TechIcon component displays SVG logos from simple-icons or custom icons
 * with original brand colors and fallback handling
 */
const TechIcon = ({ techName, size = 24 }: TechIconProps) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadIcon = async () => {
            const slug = techIconMapping[techName];

            if (!slug) {
                setError(true);
                return;
            }

            // Check if we have a custom icon first
            if (customIcons[slug]) {
                const iconPath = customIcons[slug];
                if (iconPath.endsWith('.png') || iconPath.endsWith('.jpg') || iconPath.endsWith('.jpeg')) {
                    // For raster images, use img element with error handling
                    const img = new Image();
                    img.onload = () => setImageUrl(iconPath);
                    img.onerror = () => {
                        console.warn(`Failed to load image for ${techName}: ${iconPath}`);
                        setError(true);
                    };
                    img.src = iconPath;
                } else {
                    // For SVG, fetch and validate
                    try {
                        const response = await fetch(iconPath);
                        const contentType = response.headers.get('content-type');
                        const text = await response.text();

                        // Validate it's actually SVG and not HTML
                        if (text.trim().startsWith('<svg') || contentType?.includes('svg')) {
                            setSvgContent(text);
                        } else {
                            console.warn(`Invalid SVG for ${techName}: got ${contentType || 'unknown type'}`);
                            setError(true);
                        }
                    } catch (err) {
                        console.warn(`Failed to load custom icon for ${techName}`, err);
                        setError(true);
                    }
                }
                return;
            }

            // Fall back to simple-icons
            try {
                const iconModule = await import(`simple-icons`);
                const iconKey = `si${slug.charAt(0).toUpperCase()}${slug.slice(1).replace(/-/g, '')}`;
                const icon = (iconModule as any)[iconKey];

                if (icon && icon.svg && icon.hex) {
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

    if (error || (!svgContent && !imageUrl)) {
        // Fallback: display a small neutral icon with tooltip on hover
        return (
            <div
                className="tech-icon-fallback"
                style={{ width: size, height: size, position: 'relative' }}
                title={`Icon not available: ${techName}`}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ width: '100%', height: '100%' }}
                >
                    <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="3"
                        fill="#e5e7eb"
                        stroke="#d1d5db"
                        strokeWidth="1"
                    />
                    <path
                        d="M12 8v4m0 4h.01"
                        stroke="#9ca3af"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
        );
    }

    // If we have an image URL (PNG), render as img
    if (imageUrl) {
        return (
            <div className="tech-icon" style={{ width: size, height: size }}>
                <img
                    src={imageUrl}
                    alt={techName}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </div>
        );
    }

    // Otherwise render SVG content
    return (
        <div
            className="tech-icon tech-icon-colored"
            style={{ width: size, height: size }}
            dangerouslySetInnerHTML={{ __html: svgContent! }}
        />
    );
};

export default TechIcon;
