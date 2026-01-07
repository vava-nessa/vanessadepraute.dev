import "./TechStackExtended.css";

interface TechCategory {
  title: string;
  icon: string;
  items: string[];
}

const TechStackExtended = () => {
  const categories: TechCategory[] = [
    {
      title: "⚡️ JavaScript / Core",
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
      title: "🔥 React Ecosystem",
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
      title: "💻 Frontend / UI",
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
      title: "🏷️ CSS / Styling",
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
      title: "📦️ Build Tools",
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
      title: "♻️ Design Systems",
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
      title: "🏷️ HTML5 / Graphics",
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
      title: "Backend / Infra",
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
      title: "DevOps / Cloud",
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
      title: "Mobile / Cross-platform",
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
      title: "🐛 Testing & Quality",
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
      title: "♻️ Project Management",
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
      title: "🌱 CMS / E-commerce",
      icon: "🌐",
      items: [
        "WordPress",
        "Adobe Commerce",
        "Magento",
      ],
    },
    {
      title: "🔨 Version Control",
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
      title: "🧠 LLM & AI Coding",
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
      title: "⚡ AI Dev Tools",
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
      title: "🧬 AI Infra / Vector",
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
      title: "🤖 Open-Source AI",
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
      <h2 className="tech-extended-title">Full Tech Stack & Expertise</h2>

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
                  {tech}
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
