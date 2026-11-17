export type ProjectId =
  | "creative-key"
  | "gravitad"
  | "stammer-halo"
  | "smartmeal"
  | "interruption-study"
  | "ucd-campus"

export type Page = "home" | ProjectId

export interface Project {
  id: ProjectId
  index: string
  title: string
  category: string
  context: string
  summary: string
  /** Accent that passes WCAG AA as text on white. */
  accent: string
  /** Soft tint used behind covers and in case-study heroes. */
  tint: string
  docTitle: string
  description: string
}

export const SITE_TITLE = "Angel Agharia | UX/UI & Product Designer"
export const SITE_DESCRIPTION =
  "Portfolio of Angel Agharia, a UX/UI and product designer with a BSc in Product Design and an MSc in Human–Computer Interaction. Client work, service design and HCI research."

export const PROJECTS: Project[] = [
  {
    id: "creative-key",
    index: "01",
    title: "Creative Key Ecosystem",
    category: "Service design · Physical–digital UX",
    context: "MSc HCI · UCD Creative Futures Academy · 2026",
    summary:
      "A kiosk, printed key and mobile companion that turn awareness of creative technology into confident participation.",
    accent: "#0e7490",
    tint: "#0b0f1a",
    docTitle: "Creative Key Ecosystem | Angel Agharia",
    description:
      "A physical–digital service ecosystem for UCD Creative Futures Academy: research, co-design, a Wave Rib kiosk, printed Creative Keys and a mobile companion.",
  },
  {
    id: "gravitad",
    index: "02",
    title: "Gravitad",
    category: "UX audit · Information architecture",
    context: "Professional client work · Freelance consultancy",
    summary:
      "A UX audit of an AI content platform, turned into prioritised recommendations the team could act on.",
    accent: "#055cbf",
    tint: "#eaf3ff",
    docTitle: "Gravitad UX audit | Angel Agharia",
    description:
      "Professional UX/UI consultancy: auditing an AI content platform's creation, review and history journeys and translating findings into prioritised recommendations.",
  },
  {
    id: "stammer-halo",
    index: "03",
    title: "Stammer Halo",
    category: "Wearable design · Mobile app",
    context: "Product design · Solo project",
    summary:
      "An open-ear earpiece, smart ring and companion app that bring rhythmic speech support into everyday conversations.",
    accent: "#4f46e5",
    tint: "#eef0ff",
    docTitle: "Stammer Halo | Angel Agharia",
    description:
      "Designing a discreet wearable and companion app that supports people who stammer with rhythmic speech practice, from research and sketching to 3D-printed prototypes.",
  },
  {
    id: "smartmeal",
    index: "04",
    title: "SmartMeal",
    category: "Mobile app · UX research",
    context: "UX/UI case study · Mobile app design",
    summary:
      "A meal-planning app that helps students use what they already have, spend less and waste less food.",
    accent: "#047857",
    tint: "#e9f7f1",
    docTitle: "SmartMeal | Angel Agharia",
    description:
      "A student meal-planning app: survey and interview research, two lo-fi concepts, a hi-fi Figma prototype and usability testing.",
  },
  {
    id: "interruption-study",
    index: "05",
    title: "Interruption Modality Study",
    category: "HCI research · Statistical analysis",
    context: "HCI research · Controlled experiment",
    summary:
      "A controlled experiment (n = 64) showing auditory interruptions disrupt a visual task far less than visual ones.",
    accent: "#0f766e",
    tint: "#e8f6f4",
    docTitle: "Interruption Modality Study | Angel Agharia",
    description:
      "A between-subjects HCI experiment (n = 64) on how auditory and visual interruptions affect performance in a high visual-load task, and what it means for notification design.",
  },
  {
    id: "ucd-campus",
    index: "06",
    title: "UCD Campus Collective",
    category: "Mixed methods · Student engagement",
    context: "Campus research activation · Team project",
    summary:
      "A playful campus research stall and survey exploring how commuter students experience belonging at UCD.",
    accent: "#b45309",
    tint: "#fbf3e8",
    docTitle: "UCD Campus Collective | Angel Agharia",
    description:
      "A mixed-methods campus activation exploring commuter students' sense of belonging at UCD: 180+ in-person engagements and 400+ survey responses.",
  },
]

export const PROJECT_MAP = Object.fromEntries(
  PROJECTS.map((project) => [project.id, project]),
) as Record<ProjectId, Project>

export const isProjectId = (value: unknown): value is ProjectId =>
  PROJECTS.some((project) => project.id === value)

export const nextProject = (id: ProjectId) => {
  const at = PROJECTS.findIndex((project) => project.id === id)
  return PROJECTS[(at + 1) % PROJECTS.length]
}
