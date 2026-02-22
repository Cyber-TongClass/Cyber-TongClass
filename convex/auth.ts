/**
 * Convex Auth API
 * 
 * 认证相关的查询函数
 * 注意：这是一个简化的认证系统，用于演示目的
 */

import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Check if student ID is allowed to register
export const isStudentIdAllowed = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    const authConfig = await ctx.db.query("authConfig").first()
    if (!authConfig) {
      return true
    }
    return authConfig.allowedStudentIds.includes(args.studentId)
  },
})

// Get current user - simplified version that checks database directly
// In production, this would use proper session/JWT authentication
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    // This is a simplified version - in production you'd use proper auth
    // For now, we return null and let the client handle auth state
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return null

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email!))
      .first()

    return user
  },
})

// Get current user by email (for demo login)
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email.toLowerCase()))
      .first()
    return user
  },
})

// Get current user role
export const currentUserRole = query({
  args: {},
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
  args: {},
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
  args: {},
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

// Sign out
export const signOut = mutation({
  args: {},
  handler: async () => {
    return { success: true }
  },
})
