import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatShortDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Normalize URL to ensure it has proper protocol
export function normalizeUrl(url: string): string {
  if (!url) return url
  // If URL already has protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // Add https:// for URLs without protocol
  return `https://${url}`
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Sort by Chinese pinyin
export function sortByPinyin<T extends { name: string }>(items: T[]): T[] {
  // Simple pinyin sort - would need a proper pinyin library for production
  return items.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
}

// Research areas mapping
export const RESEARCH_AREAS = {
  ML: {
    label: 'Machine Learning',
    subAreas: [
      'Supervised Learning',
      'Unsupervised Learning', 
      'Semi-supervised Learning',
      'Self-supervised Learning',
      'Representation Learning',
      'Optimization',
      'Generalization',
      'Theory',
    ]
  },
  DL: {
    label: 'Deep Learning',
    subAreas: [
      'Architectures',
      'Training Methods',
      'Scaling Laws',
      'Efficiency',
      'Pruning',
      'Quantization',
    ]
  },
  CV: {
    label: 'Computer Vision',
    subAreas: [
      'Image Understanding',
      'Video Understanding',
      'Detection',
      'Segmentation',
      '3D Vision',
      'Vision-Language',
    ]
  },
  NLP: {
    label: 'Natural Language Processing',
    subAreas: [
      'Language Modeling',
      'Machine Translation',
      'Information Extraction',
      'Dialogue',
      'Multilingual NLP',
      'Reasoning',
    ]
  },
  MM: {
    label: 'Multimodal AI',
    subAreas: [
      'Vision-Language',
      'Audio-Language',
      'Multimodal Reasoning',
      'Multimodal Generation',
    ]
  },
  GEN: {
    label: 'Generative Modeling',
    subAreas: [
      'Diffusion',
      'Autoregressive',
      'Flow Models',
      'VAEs',
      'Controllable Generation',
    ]
  },
  RL: {
    label: 'Reinforcement Learning',
    subAreas: [
      'Policy Learning',
      'Offline RL',
      'Planning',
      'Exploration',
      'Decision Making',
    ]
  },
  MAS: {
    label: 'Multi-Agent Systems',
    subAreas: [
      'Cooperation',
      'Competition',
      'Game Theory',
      'Communication Learning',
    ]
  },
  ROB: {
    label: 'Robotics',
    subAreas: [
      'Manipulation',
      'Navigation',
      'Control',
      'Sim2Real',
      'Embodied Learning',
    ]
  },
  SYS: {
    label: 'AI Systems',
    subAreas: [
      'Distributed Training',
      'Efficient Inference',
      'Hardware-aware Learning',
      'Compilation',
      'Deployment',
    ]
  },
  SAFE: {
    label: 'AI Safety',
    subAreas: [
      'Alignment',
      'Interpretability',
      'Robustness',
      'Fairness',
      'Privacy',
    ]
  },
  KA: {
    label: 'Knowledge & Reasoning',
    subAreas: [
      'Knowledge Graphs',
      'Symbolic AI',
      'Neuro-symbolic',
      'Logical Reasoning',
      'Causal Reasoning',
    ]
  },
  SCI: {
    label: 'AI for Science',
    subAreas: [
      'Chemistry',
      'Biology',
      'Physics',
      'Materials',
      'Climate',
      'Medicine',
    ]
  },
  HCI: {
    label: 'Human-AI Interaction',
    subAreas: [
      'Human Feedback',
      'Interactive Learning',
      'Usability',
      'Personalization',
    ]
  },
  APP: {
    label: 'Applications',
    subAreas: [
      'Recommendation',
      'Finance',
      'Education',
      'Healthcare',
      'Industry',
    ]
  },
} as const

export type ResearchArea = keyof typeof RESEARCH_AREAS
