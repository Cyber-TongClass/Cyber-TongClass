import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

const normalizeEmail = (email: string) => email.trim().toLowerCase()
const normalizeUsername = (username: string) => username.trim().toLowerCase()
const normalizeStudentId = (studentId: string) => studentId.trim()

const pickDefined = <T extends Record<string, any>>(input: T) => {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as Partial<T>
}

// Get all users with pagination
export const list = query({
  args: {
    skip: v.optional(v.number()),
    limit: v.optional(v.number()),
    organization: v.optional(v.union(v.literal("pku"), v.literal("thu"))),
    cohort: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let usersQuery = ctx.db.query("users")

    if (args.organization) {
      usersQuery = usersQuery.filter((q) => q.eq(q.field("organization"), args.organization))
    }

    if (args.cohort !== undefined) {
      usersQuery = usersQuery.filter((q) => q.eq(q.field("cohort"), args.cohort))
    }

    const allUsers = await usersQuery.order("desc").collect()
    const skip = args.skip || 0
    const limit = args.limit || 50
    return allUsers.slice(skip, skip + limit)
  },
})

// Get a single user by ID
export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id)
    return user
  },
})

// Get a single user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const normalizedEmail = normalizeEmail(args.email)

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), normalizedEmail))
      .first()

    return user
  },
})

// Get a single user by student ID
export const getByStudentId = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    const normalizedStudentId = normalizeStudentId(args.studentId)

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("studentId"), normalizedStudentId))
      .first()

    return user
  },
})

// Create a new user
export const create = mutation({
  args: {
    email: v.string(),
    username: v.string(),
    englishName: v.string(),
    organization: v.union(v.literal("pku"), v.literal("thu")),
    cohort: v.number(),
    studentId: v.string(),
    role: v.optional(v.union(v.literal("member"), v.literal("admin"), v.literal("super_admin"))),
    password: v.optional(v.string()),
    personalEmail: v.optional(v.string()),
    bio: v.optional(v.string()),
    researchInterests: v.optional(v.array(v.string())),
    titles: v.optional(v.array(v.object({ title: v.string(), link: v.string() }))),
    scholarUrl: v.optional(v.string()),
    orcidUrl: v.optional(v.string()),
    avatar: v.optional(v.string()),
    realPhoto: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email)
    const username = normalizeUsername(args.username)
    const studentId = normalizeStudentId(args.studentId)

    const [existingEmailUser, existingUsernameUser, existingStudentIdUser] = await Promise.all([
      ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), email))
        .first(),
      ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("username"), username))
        .first(),
      ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("studentId"), studentId))
        .first(),
    ])

    if (existingEmailUser) {
      throw new Error("User email already exists")
    }

    if (existingUsernameUser) {
      throw new Error("Username already exists")
    }

    if (existingStudentIdUser) {
      throw new Error("Student ID already exists")
    }

    const now = Date.now()

    const userId = await ctx.db.insert("users", {
      email,
      username,
      englishName: args.englishName.trim(),
      role: args.role || "member",
      organization: args.organization,
      cohort: args.cohort,
      studentId,
      personalEmail: args.personalEmail,
      bio: args.bio,
      researchInterests: args.researchInterests,
      titles: args.titles,
      scholarUrl: args.scholarUrl,
      orcidUrl: args.orcidUrl,
      avatar: args.avatar,
      realPhoto: args.realPhoto,
      isEmailVerified: false,
      createdAt: now,
      updatedAt: now,
    })

    if (args.password && args.password.trim()) {
      const existingCredential = await ctx.db
        .query("authCredentials")
        .filter((q) => q.eq(q.field("userId"), userId))
        .first()

      if (existingCredential) {
        await ctx.db.patch(existingCredential._id, {
          passwordHash: args.password,
        })
      } else {
        await ctx.db.insert("authCredentials", {
          userId,
          passwordHash: args.password,
        })
      }
    }

    return userId
  },
})

// Update user profile
export const update = mutation({
  args: {
    id: v.id("users"),
    email: v.optional(v.string()),
    username: v.optional(v.string()),
    englishName: v.optional(v.string()),
    organization: v.optional(v.union(v.literal("pku"), v.literal("thu"))),
    cohort: v.optional(v.number()),
    studentId: v.optional(v.string()),
    role: v.optional(v.union(v.literal("member"), v.literal("admin"), v.literal("super_admin"))),
    password: v.optional(v.string()),
    personalEmail: v.optional(v.string()),
    bio: v.optional(v.string()),
    researchInterests: v.optional(v.array(v.string())),
    titles: v.optional(v.array(v.object({ title: v.string(), link: v.string() }))),
    scholarUrl: v.optional(v.string()),
    orcidUrl: v.optional(v.string()),
    avatar: v.optional(v.string()),
    realPhoto: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, password, ...updates } = args

    const user = await ctx.db.get(id)

    if (!user) {
      throw new Error("User not found")
    }

    const nextEmail = updates.email ? normalizeEmail(updates.email) : undefined
    const nextUsername = updates.username ? normalizeUsername(updates.username) : undefined
    const nextStudentId = updates.studentId ? normalizeStudentId(updates.studentId) : undefined

    if (nextEmail && nextEmail !== user.email) {
      const existingByEmail = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), nextEmail))
        .first()

      if (existingByEmail && existingByEmail._id !== id) {
        throw new Error("User email already exists")
      }
    }

    if (nextUsername && nextUsername !== user.username) {
      const existingByUsername = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("username"), nextUsername))
        .first()

      if (existingByUsername && existingByUsername._id !== id) {
        throw new Error("Username already exists")
      }
    }

    if (nextStudentId && nextStudentId !== user.studentId) {
      const existingByStudentId = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("studentId"), nextStudentId))
        .first()

      if (existingByStudentId && existingByStudentId._id !== id) {
        throw new Error("Student ID already exists")
      }
    }

    const patchData = pickDefined({
      ...updates,
      email: nextEmail,
      username: nextUsername,
      studentId: nextStudentId,
      updatedAt: Date.now(),
    })

    await ctx.db.patch(id, patchData)

    if (password && password.trim()) {
      const existingCredential = await ctx.db
        .query("authCredentials")
        .filter((q) => q.eq(q.field("userId"), id))
        .first()

      if (existingCredential) {
        await ctx.db.patch(existingCredential._id, {
          passwordHash: password,
        })
      } else {
        await ctx.db.insert("authCredentials", {
          userId: id,
          passwordHash: password,
        })
      }
    }

    return id
  },
})

// Update user role (admin only)
export const updateRole = mutation({
  args: {
    id: v.id("users"),
    role: v.union(v.literal("member"), v.literal("admin"), v.literal("super_admin")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id)

    if (!user) {
      throw new Error("User not found")
    }

    await ctx.db.patch(args.id, {
      role: args.role,
      updatedAt: Date.now(),
    })

    return args.id
  },
})

// Delete a user (admin only)
export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id)

    if (!user) {
      throw new Error("User not found")
    }

    const credential = await ctx.db
      .query("authCredentials")
      .filter((q) => q.eq(q.field("userId"), args.id))
      .first()

    if (credential) {
      await ctx.db.delete(credential._id)
    }

    await ctx.db.delete(args.id)
    return args.id
  },
})

// Simple login for local development
export const simpleLogin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const identifier = args.email.trim().toLowerCase()

    const user = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.eq(q.field("email"), identifier),
          q.eq(q.field("username"), identifier)
        )
      )
      .first()

    if (!user) {
      throw new Error("用户不存在")
    }

    const credential = await ctx.db
      .query("authCredentials")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first()

    if (credential && credential.passwordHash !== args.password) {
      throw new Error("密码错误")
    }

    return {
      success: true,
      userId: user._id,
      email: user.email,
      role: user.role,
    }
  },
})

// Get users count
export const count = query({
  args: {
    organization: v.optional(v.union(v.literal("pku"), v.literal("thu"))),
  },
  handler: async (ctx, args) => {
    let usersQuery = ctx.db.query("users")

    if (args.organization) {
      usersQuery = usersQuery.filter((q) => q.eq(q.field("organization"), args.organization))
    }

    const users = await usersQuery.collect()
    return users.length
  },
})

// Search users by name
export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const keyword = args.query.trim()

    const users = await ctx.db
      .query("users")
      .filter((q) =>
        q.or(
          q.contains(q.field("englishName"), keyword),
          q.contains(q.field("username"), keyword)
        )
      )
      .take(20)
      .collect()

    return users
  },
})
