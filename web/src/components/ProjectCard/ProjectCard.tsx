import { useEffect, useState } from "react";
import "./ProjectCard.css";

interface ProjectCardProps {
    name: string;
    year: string;
    status: string;
    description: string;
    techStack: string[];
    highlights: string[];
}

const ProjectCard = ({ name, year, status, description, techStack, highlights }: ProjectCardProps) => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const checkTheme = () => {
            const isLight = document.documentElement.classList.contains('light-mode');
            setIsDarkMode(!isLight);
        };

        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className={`project-card ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="project-header">
                <div className="project-title-row">
                    <h3 className="project-name">{name}</h3>
                    <span className="project-year">{year}</span>
                </div>
                <span className={`project-status ${status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {status}
                </span>
            </div>

            <p className="project-description">{description}</p>

            <div className="project-highlights">
                {highlights.map((highlight, index) => (
                    <span key={index} className="highlight-badge">
                        {highlight}
                    </span>
                ))}
            </div>

            <div className="project-tech-stack">
                <div className="tech-stack-label">Tech Stack:</div>
                <div className="tech-stack-tags">
                    {techStack.map((tech, index) => (
                        <span key={index} className="tech-tag">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
