export interface PublicationCategoryOption {
  value: string
  label: string
  subCategories: string[]
}

const baseCategoryOptions: PublicationCategoryOption[] = [
  {
    value: "Machine Learning",
    label: "ML · Machine Learning",
    subCategories: [
      "supervised learning",
      "unsupervised learning",
      "semi-supervised learning",
      "self-supervised learning",
      "representation learning",
      "optimization",
      "generalization",
      "theory",
      "Deep Learning",
      "architectures",
      "training methods",
      "scaling laws",
      "efficiency",
      "pruning",
      "quantization",
    ],
  },
  {
    value: "Computer Vision",
    label: "CV · Computer Vision",
    subCategories: [
      "image understanding",
      "video understanding",
      "detection",
      "segmentation",
      "3D vision",
      "vision-language",
    ],
  },
  {
    value: "Natural Language Processing",
    label: "NLP · Natural Language Processing",
    subCategories: [
      "language modeling",
      "machine translation",
      "information extraction",
      "dialogue",
      "multilingual NLP",
      "reasoning",
    ],
  },
  {
    value: "Multimodal AI",
    label: "MM · Multimodal AI",
    subCategories: ["vision-language", "audio-language", "multimodal reasoning", "multimodal generation"],
  },
  {
    value: "Generative Modeling",
    label: "GEN · Generative Modeling",
    subCategories: ["diffusion", "autoregressive", "flow models", "VAEs", "controllable generation"],
  },
  {
    value: "Reinforcement Learning",
    label: "RL · Reinforcement Learning",
    subCategories: ["policy learning", "offline RL", "planning", "exploration", "decision making"],
  },
  {
    value: "Multi-Agent Systems",
    label: "MAS · Multi-Agent Systems",
    subCategories: ["cooperation", "competition", "game theory", "communication learning"],
  },
  {
    value: "Robotics",
    label: "ROB · Robotics",
    subCategories: ["manipulation", "navigation", "control", "sim2real", "embodied learning"],
  },
  {
    value: "AI Systems",
    label: "SYS · AI Systems",
    subCategories: ["distributed training", "efficient inference", "hardware-aware learning", "compilation", "deployment"],
  },
  {
    value: "AI Safety",
    label: "SAFE · AI Safety",
    subCategories: ["alignment", "interpretability", "robustness", "fairness", "privacy"],
  },
  {
    value: "Knowledge & Reasoning",
    label: "KA · Knowledge & Reasoning",
    subCategories: ["knowledge graphs", "symbolic AI", "neuro-symbolic", "logical reasoning", "causal reasoning"],
  },
  {
    value: "AI for Science",
    label: "SCI · AI for Science",
    subCategories: ["chemistry", "biology", "physics", "materials", "climate", "medicine"],
  },
  {
    value: "Human-AI Interaction",
    label: "HCI · Human-AI Interaction",
    subCategories: ["human feedback", "interactive learning", "usability", "personalization"],
  },
  {
    value: "Applications",
    label: "APP · Applications",
    subCategories: ["recommendation", "finance", "education", "healthcare", "industry"],
  },
]

export const PUBLICATION_CATEGORIES = baseCategoryOptions

export const DEFAULT_PUBLICATION_CATEGORY = baseCategoryOptions[0]?.value || ""

export function getPublicationCategoryOptions(currentCategory?: string): PublicationCategoryOption[] {
  if (!currentCategory) {
    return baseCategoryOptions
  }

  const exists = baseCategoryOptions.some((option) => option.value === currentCategory)
  if (exists) {
    return baseCategoryOptions
  }

  return [
    {
      value: currentCategory,
      label: currentCategory,
      subCategories: [],
    },
    ...baseCategoryOptions,
  ]
}

export function getPublicationSubCategoryOptions(category: string, currentSubCategory?: string): string[] {
  const matched = baseCategoryOptions.find((option) => option.value === category)
  const baseOptions = matched?.subCategories ?? []

  if (!currentSubCategory || baseOptions.includes(currentSubCategory)) {
    return baseOptions
  }

  return [currentSubCategory, ...baseOptions]
}

export function parsePublicationAuthors(input: string): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const author of input.split(/[\n,]/)) {
    const trimmed = author.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    result.push(trimmed)
  }

  return result
}

export function formatPublicationAuthors(authors: string[]): string {
  return authors.join("\n")
}
