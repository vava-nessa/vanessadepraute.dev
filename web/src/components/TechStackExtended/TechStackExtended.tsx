import "./TechStackExtended.css";
import { useTranslation } from "react-i18next";
import TechIcon from "./TechIcon";

interface TechCategory {
  title: string;
  icon: string;
  items: string[];
}

const TechStackExtended = () => {
  const { t } = useTranslation();
  const categories: TechCategory[] = [
    {
      title: t("techStack.categories.jsCore"),
      icon: "⚡",
      items: [
        "JavaScript",
        "TypeScript",
        "ES10+",
        "Async/Await",
        "Promises",
        "Spread/Rest",
        "Dynamic Import",
        "Generators",
        "Memoization",
      ],
    },
    {
      title: t("techStack.categories.reactEcosystem"),
      icon: "⚛️",
      items: [
        "React",
        "NextJS",
        "Redux Saga",
        "Redux Thunk",
        "Recoil",
        "Custom Hooks",
        "Context API",
        "React Query",
        "TanStack Query",
      ],
    },
    {
      title: t("techStack.categories.frontendUI"),
      icon: "🎨",
      items: [
        "Tailwind CSS",
        "Vite",
        "Figma",
        "Framer Motion",
        "ShadCN/UI",
        "Storybook",
        "Prettier",
        "VueJS",
        "Styled Components",
        "Material UI",
        "Ant Design",
        "Chakra UI",
        "Adobe XD",
        "Illustrator",
        "Photoshop",
      ],
    },
    {
      title: t("techStack.categories.cssStyling"),
      icon: "🎨",
      items: [
        "CSS3",
        "SASS/SCSS",
        "LESS",
        "Bootstrap",
        "Flexbox",
        "BEM",
        "Atomic Design",
        "Responsive Design",
      ],
    },
    {
      title: t("techStack.categories.buildTools"),
      icon: "🔧",
      items: [
        "Webpack",
        "Parcel",
        "Gulp",
        "Snowpack",
        "Vite",
        "Storybook",
      ],
    },
    {
      title: t("techStack.categories.designSystems"),
      icon: "🎭",
      items: [
        "Material UI",
        "Ant Design",
        "Chakra UI",
        "ShadCN/UI",
        "Storybook",
      ],
    },
    {
      title: t("techStack.categories.html5Graphics"),
      icon: "🖼️",
      items: [
        "HTML5",
        "Canvas",
        "SVG Animation",
        "BabylonJS",
        "WebGL",
      ],
    },
    {
      title: t("techStack.categories.backendInfra"),
      icon: "⚙️",
      items: [
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "Prisma",
        "Docker",
        "Redis",
        "Stripe",
        "tRPC",
        "GraphQL",
        "Express",
      ],
    },
    {
      title: t("techStack.categories.devopsCloud"),
      icon: "☁️",
      items: [
        "Vercel",
        "GitHub",
        "GitLab",
        "Bitbucket",
        "GitHub Actions",
        "Cloudflare",
        "AWS",
        "Terraform",
        "Kubernetes",
        "Datadog",
        "CI/CD",
      ],
    },
    {
      title: t("techStack.categories.mobileCP"),
      icon: "📱",
      items: [
        "React Native",
        "Expo",
        "EAS",
        "Firebase",
        "Ionic",
      ],
    },
    {
      title: t("techStack.categories.testing"),
      icon: "✅",
      items: [
        "Jest",
        "Playwright",
        "Vitest",
        "React Testing Library",
        "Testing Library",
        "Cypress",
      ],
    },
    {
      title: t("techStack.categories.projectManagement"),
      icon: "📋",
      items: [
        "Jira",
        "Trello",
        "Notion",
        "Bitbucket",
        "Agile/Scrum",
      ],
    },
    {
      title: t("techStack.categories.cmsEcommerce"),
      icon: "🌐",
      items: [
        "WordPress",
        "Adobe Commerce",
        "Magento",
      ],
    },
    {
      title: t("techStack.categories.versionControl"),
      icon: "🔧",
      items: [
        "Git",
        "GitHub",
        "GitLab",
        "Bitbucket",
        "GitHub Actions",
      ],
    },
    {
      title: t("techStack.categories.llmAI"),
      icon: "🤖",
      items: [
        "OpenAI",
        "Anthropic",
        "Mistral AI",
        "DeepSeek",
        "Cohere",
        "Google Gemini",
        "xAI",
        "Perplexity",
        "Claude Code",
        "Groq",
        "Together AI",
      ],
    },
    {
      title: t("techStack.categories.aiDevTools"),
      icon: "⚙️",
      items: [
        "GitHub Copilot",
        "Cursor",
        "Continue",
        "Replit",
        "Codeium",
        "Tabnine",
        "Warp",
        "Claude Code",
        "v0.dev",
        "Cody",
      ],
    },
    {
      title: t("techStack.categories.aiInfra"),
      icon: "🔗",
      items: [
        "Pinecone",
        "Weaviate",
        "Qdrant",
        "Chroma",
        "LangChain",
        "LlamaIndex",
        "Hugging Face",
        "pgvector",
        "Milvus",
        "LangSmith",
      ],
    },
    {
      title: t("techStack.categories.openSourceAI"),
      icon: "📦",
      items: [
        "Meta LLaMA",
        "Stability AI",
        "OpenRouter",
        "Ollama",
        "vLLM",
        "Mistral 7B",
        "Solar",
        "Phi",
      ],
    },
  ];

  return (
    <div className="tech-extended-container">
      <h2 className="tech-extended-title">{t("techStack.title")}</h2>

      <div className="tech-categories">
        {categories.map((category, index) => (
          <div key={index} className="tech-category">
            <h3 className="category-title">
              <span className="category-icon">{category.icon}</span>
              {category.title}
            </h3>
            <div className="tech-grid">
              {category.items.map((tech, techIndex) => (
                <div key={techIndex} className="tech-card">
                  <TechIcon techName={tech} size={72} />
                  <span className="tech-name">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackExtended;
