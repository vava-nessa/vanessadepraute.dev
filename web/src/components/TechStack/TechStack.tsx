import claudeCode from "../../assets/techstack/claudecode.png";
import javascript from "../../assets/techstack/javascript-logo-svgrepo-com.svg";
import mongodb from "../../assets/techstack/mongodb.svg";
import nextjs from "../../assets/techstack/nextjs.svg";
import nodejs from "../../assets/techstack/nodejs.svg";
import reactjs from "../../assets/techstack/reactjs.svg";
import reactnative from "../../assets/techstack/reactnative.png";
import supabase from "../../assets/techstack/supabase.svg";
import "./TechStack.css";

const TechStack = () => {
  const logos = [
    { name: "JavaScript", src: javascript },
    { name: "React", src: reactjs },
    { name: "Next.js", src: nextjs },
    { name: "Node.js", src: nodejs },
    { name: "React Native", src: reactnative },
    { name: "MongoDB", src: mongodb },
    { name: "Supabase", src: supabase },
    { name: "Claude Code", src: claudeCode },
  ];

  return (
    <div className="techstack-container">
      <div className="techstack-track">
        <div className="techstack-content">
          {logos.map((logo, index) => (
            <div key={index} className="techstack-logo-wrapper">
              <img
                src={logo.src}
                alt={logo.name}
                className={`techstack-logo ${logo.name === "Next.js" ? "techstack-logo--nextjs" : ""}`}
                title={logo.name}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
