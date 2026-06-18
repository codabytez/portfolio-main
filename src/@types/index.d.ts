type Tech =
  | "react"
  | "react-native"
  | "nextjs"
  | "html"
  | "css"
  | "vue"
  | "angular"
  | "gatsby"
  | "flutter"
  | "svelte";

interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  tech: Tech[];
  primaryTech?: Tech;
  longDescription?: string;
  features?: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface TechMeta {
  type: Tech;
  icon: string;
  label: string;
}

interface TechIconBoxProps {
  className?: string;
  type?: Tech;
}

interface ProjectCardProps {
  className?: string;
  name?: string;
  slug?: string;
  image?: string;
  description?: string;
  tech?: Tech;
  href?: string;
}

interface ProjectsSidebarProps {
  selectedTechs: Tech[];
  onToggle: (tech: Tech) => void;
}
