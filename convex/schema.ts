import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // Users table
  users: defineTable({
    email: v.string(),
    username: v.string(),
    englishName: v.string(),
    role: v.union(v.literal("member"), v.literal("admin"), v.literal("super_admin")),
    organization: v.union(v.literal("pku"), v.literal("thu")),
    cohort: v.number(),
    studentId: v.string(),
    personalEmail: v.optional(v.string()),
    bio: v.optional(v.string()),
    researchInterests: v.optional(v.array(v.string())),
    titles: v.optional(v.array(v.object({ title: v.string(), link: v.string() }))),
    scholarUrl: v.optional(v.string()),
    orcidUrl: v.optional(v.string()),
    avatar: v.optional(v.string()),
    realPhoto: v.optional(v.string()),
    isEmailVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_studentId", ["studentId"])
    .index("by_role", ["role"])
    .index("by_organization", ["organization", "cohort"]),

  // Publications table
  publications: defineTable({
    title: v.string(),
    authors: v.array(v.string()),
    venue: v.string(),
    year: v.number(),
    abstract: v.string(),
    url: v.optional(v.string()),
    category: v.string(),
    subCategory: v.optional(v.string()),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_year", ["year"])
    .index("by_category", ["category"])
    .searchIndex("search_title", { searchField: "title" }),

  // Course reviews table
  courseReviews: defineTable({
    courseName: v.string(),
    semester: v.string(),
    rating: v.number(),
    content: v.string(),
    isAnonymous: v.boolean(),
    authorId: v.optional(v.id("users")),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_course", ["courseName"])
    .index("by_status", ["status"])
    .index("by_semester", ["semester"]),

  // News table
  news: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
    authorName: v.optional(v.string()),
    category: v.string(),
    publishedAt: v.number(),
    isPublished: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_publishedAt", ["publishedAt"])
    .index("by_category", ["category"])
    .index("by_author", ["authorId"])
    .searchIndex("search_title", { searchField: "title" }),

  // Events table
  events: defineTable({
    title: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    endDate: v.optional(v.string()),
    endTime: v.optional(v.string()),
    location: v.optional(v.string()),
    description: v.optional(v.string()),
    url: v.optional(v.string()),
    color: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_date", ["date"]),

  // Courses table
  courses: defineTable({
    name: v.string(),
    instructor: v.string(),
    department: v.string(),
    reviewCount: v.number(),
    averageRating: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"]),

  // Auth config table (for pre-registered student IDs)
  authConfig: defineTable({
    allowedStudentIds: v.array(v.string()),
    updatedAt: v.number(),
  }),

  // Auth credentials table (for password auth)
  authCredentials: defineTable({
    userId: v.id("users"),
    passwordHash: v.string(),
  })
    .index("by_userId", ["userId"]),
})
