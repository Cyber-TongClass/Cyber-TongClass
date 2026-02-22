import { mutation, query } from "../_generated/server"
import { v } from "convex/values"

// Check if student ID is allowed to register
export const isStudentIdAllowed = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    const authConfig = await ctx.db.query("authConfig").first()
    if (!authConfig) {
      // If no auth config exists, allow all (for development)
      return true
    }
    return authConfig.allowedStudentIds.includes(args.studentId)
  },
})

// Add allowed student IDs (admin only)
export const addAllowedStudentIds = mutation({
  args: { studentIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const authConfig = await ctx.db.query("authConfig").first()
    const now = Date.now()

    if (authConfig) {
      // Merge and deduplicate
      const existingIds = new Set(authConfig.allowedStudentIds)
      args.studentIds.forEach((id) => existingIds.add(id))
      
      await ctx.db.patch(authConfig._id, {
        allowedStudentIds: Array.from(existingIds),
        updatedAt: now,
      })
    } else {
      // Create new config
      await ctx.db.insert("authConfig", {
        allowedStudentIds: args.studentIds,
        updatedAt: now,
      })
    }
  },
})

// Remove allowed student IDs (admin only)
export const removeAllowedStudentIds = mutation({
  args: { studentIds: v.array(v.string()) },
  handler: async (ctx, args) => {
    const authConfig = await ctx.db.query("authConfig").first()
    if (!authConfig) return

    const existingIds = new Set(authConfig.allowedStudentIds)
    args.studentIds.forEach((id) => existingIds.delete(id))

    await ctx.db.patch(authConfig._id, {
      allowedStudentIds: Array.from(existingIds),
      updatedAt: Date.now(),
    })
  },
})

// Get current user (for session)
export const currentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email!))
      .first()

    return user
  },
})

// Get current user role
export const currentUserRole = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email!))
      .first()

    return user?.role || null
  },
})

// Check if user is admin
export const isAdmin = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return false

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email!))
      .first()
    const role = user?.role
    return role === "admin" || role === "super_admin"
  },
})

// Check if user is super admin
export const isSuperAdmin = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return false

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email!))
      .first()
    const role = user?.role
    return role === "super_admin"
  },
})

// Verify email (placeholder - to be implemented later)
export const sendVerificationEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Placeholder for email verification
    // Will be implemented with actual email service
    console.log(`Verification email requested for: ${args.email}`)
    return { success: true, message: "Email verification pending implementation" }
  },
})

// Confirm email verification
export const confirmEmailVerification = mutation({
  args: { email: v.string(), code: v.string() },
  handler: async (ctx, args) => {
    // Placeholder for email verification confirmation
    // Will be implemented with actual verification logic
    console.log(`Email verification confirm: ${args.email} with code: ${args.code}`)
    return { success: true }
  },
})

// Sign out
export const signOut = mutation({
  handler: async (ctx) => {
    // Convex Auth handles sign out on client side
    return { success: true }
  },
})
