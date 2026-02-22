// User types
export type UserRole = 'member' | 'admin' | 'super_admin'

export interface User {
  _id: string
  email: string
  username: string
  englishName: string
  role: UserRole
  organization: 'pku' | 'thu'
  cohort: number // 2020, 2021, etc.
  studentId: string
  personalEmail?: string
  bio?: string // Markdown
  researchInterests?: string[]
  titles?: { title: string; link: string }[]
  scholarUrl?: string
  orcidUrl?: string
  avatar?: string
  realPhoto?: string
  createdAt: number
  updatedAt: number
}

// Publication types
export interface Publication {
  _id: string
  title: string
  authors: string[]
  venue: string
  year: number
  abstract: string
  url?: string
  category: string
  subCategory?: string
  userId: string // Owner
  createdAt: number
  updatedAt: number
}

// Course review types
export interface CourseReview {
  _id: string
  courseName: string
  semester: string // e.g., "2024 Spring"
  rating: number // 0-10
  content: string
  isAnonymous: boolean
  authorId?: string // Optional, for admin
  status: 'pending' | 'approved' | 'rejected'
  createdAt: number
  updatedAt: number
}

export interface Course {
  _id: string
  name: string
  instructor: string
  department: string
  aliases?: string[] // Alternative names for merge detection
  reviewCount: number
  averageRating: number
  createdAt: number
  updatedAt: number
}

// News types
export interface News {
  _id: string
  title: string
  content: string // Markdown
  authorId: string
  authorName?: string // Custom author name
  category: string
  publishedAt: number
  isPublished: boolean
  createdAt: number
  updatedAt: number
}

// Event types
export interface Event {
  _id: string
  title: string
  date: string // ISO date
  time?: string
  endDate?: string
  endTime?: string
  location?: string
  description?: string // Markdown
  url?: string
  color: string // For calendar display
  createdAt: number
  updatedAt: number
}

// Auth types
export interface AuthConfig {
  // Pre-registered student IDs (hashed)
  allowedStudentIds: string[]
}

// Organization types
export const ORGANIZATIONS = {
  PKU: {
    id: 'pku',
    name: 'Peking University',
    shortName: 'PKU',
    cohorts: [2020, 2021, 2022, 2023, 2024, 2025] as const,
  },
  THU: {
    id: 'thu',
    name: 'Tsinghua University',
    shortName: 'THU',
    cohorts: [2020, 2021, 2022, 2023, 2024, 2025] as const,
  },
} as const

export type OrganizationId = typeof ORGANIZATIONS.PKU | typeof ORGANIZATIONS.THU

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Filter types
export interface PublicationFilters {
  search?: string
  category?: string
  year?: number
  author?: string
}

export interface NewsFilters {
  category?: string
  authorId?: string
  fromDate?: string
  toDate?: string
}

export interface CourseFilters {
  search?: string
  semester?: string
  sortBy?: 'rating' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface EventFilters {
  fromDate?: string
  toDate?: string
}
