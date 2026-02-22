import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Get approved course reviews by course name
export const listByCourse = query({
  args: {
    courseName: v.string(),
    semester: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("courseReviews")
      .filter((q) => q.eq(q.field("status"), "approved"))
    
    query = query.filter((q) => q.eq(q.field("courseName"), args.courseName))
    
    if (args.semester) {
      query = query.filter((q) => q.eq(q.field("semester"), args.semester))
    }
    
    const reviews = await query.order("desc").collect()
    return reviews
  },
})

// Get all reviews for a course (admin only)
export const listByCourseAll = query({
  args: {
    courseName: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("courseReviews")
    
    // Filter by courseName if provided
    if (args.courseName) {
      query = query.filter((q) => q.eq(q.field("courseName"), args.courseName))
    }
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status))
    }
    
    const reviews = await query.order("desc").collect()
    return reviews
  },
})

// Get all pending reviews (admin only)
export const listPending = query({
  args: {
    skip: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("courseReviews")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .order("desc")
      .collect()
    
    const skip = args.skip || 0
    const limit = args.limit || 50
    return reviews.slice(skip, skip + limit)
  },
})

// Get all unique course names
export const listCourses = query({
  handler: async (ctx) => {
    const reviews = await ctx.db
      .query("courseReviews")
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect()
    
    // Group by course name and calculate average rating
    const courseMap = new Map<string, { count: number; totalRating: number }>()
    
    for (const review of reviews) {
      const existing = courseMap.get(review.courseName)
      if (existing) {
        existing.count++
        existing.totalRating += review.rating
      } else {
        courseMap.set(review.courseName, { count: 1, totalRating: review.rating })
      }
    }
    
    const courses = Array.from(courseMap.entries()).map(([name, data]) => ({
      name,
      reviewCount: data.count,
      averageRating: Math.round((data.totalRating / data.count) * 10) / 10,
    }))
    
    return courses.sort((a, b) => b.reviewCount - a.reviewCount)
  },
})

// Create a new course review
export const create = mutation({
  args: {
    courseName: v.string(),
    semester: v.string(),
    rating: v.number(),
    content: v.string(),
    isAnonymous: v.optional(v.boolean()),
    authorId: v.optional(v.id("users")),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    const reviewId = await ctx.db.insert("courseReviews", {
      courseName: args.courseName,
      semester: args.semester,
      rating: args.rating,
      content: args.content,
      isAnonymous: args.isAnonymous ?? true,
      authorId: args.authorId,
      status: args.status ?? "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    return reviewId
  },
})

// Update a review (admin only)
export const update = mutation({
  args: {
    id: v.id("courseReviews"),
    courseName: v.optional(v.string()),
    semester: v.optional(v.string()),
    rating: v.optional(v.number()),
    content: v.optional(v.string()),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args
    const review = await ctx.db.get(id)
    if (!review) {
      throw new Error("Review not found")
    }
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() })
    return id
  },
})

// Approve a review (admin only)
export const approve = mutation({
  args: { id: v.id("courseReviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.id)
    if (!review) {
      throw new Error("Review not found")
    }
    await ctx.db.patch(args.id, { status: "approved", updatedAt: Date.now() })
    return args.id
  },
})

// Reject a review (admin only)
export const reject = mutation({
  args: { id: v.id("courseReviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.id)
    if (!review) {
      throw new Error("Review not found")
    }
    await ctx.db.patch(args.id, { status: "rejected", updatedAt: Date.now() })
    return args.id
  },
})

// Delete a review (admin only)
export const remove = mutation({
  args: { id: v.id("courseReviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.id)
    if (!review) {
      throw new Error("Review not found")
    }
    await ctx.db.delete(args.id)
    return args.id
  },
})

// Bulk update course name (for merging courses)
export const updateCourseName = mutation({
  args: {
    oldName: v.string(),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("courseReviews")
      .filter((q) => q.eq(q.field("courseName"), args.oldName))
      .collect()
    
    for (const review of reviews) {
      await ctx.db.patch(review._id, { courseName: args.newName, updatedAt: Date.now() })
    }
    
    return reviews.length
  },
})
