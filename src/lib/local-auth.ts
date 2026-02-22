/**
 * @deprecated 此文件已弃用，请使用 @/lib/hooks/useAuth hook 替代
 * 
 * 此文件保留用于向后兼容，最终将被移除。
 * 
 * 使用示例:
 *   - 使用 useAuth() hook 获取当前用户信息
 *   - 使用 login() 函数进行登录
 *   - 使用 signOut() 进行登出
 */

"use client"

import type { User, UserRole } from "@/types"

type StoredUser = User & {
  password: string
  isEmailVerified: boolean
}

export type AuthUser = Omit<StoredUser, "password">

type AuthStore = {
  users: StoredUser[]
  currentUserId: string | null
}

const STORAGE_KEY = "tongclass.auth.v1"
const AUTH_CHANGE_EVENT = "tongclass-auth-change"

const now = () => Date.now()

const seedUsers: StoredUser[] = [
  {
    _id: "seed-super-admin",
    email: "superadmin@stu.pku.edu.cn",
    username: "superadmin",
    englishName: "Super Admin",
    role: "super_admin",
    organization: "pku",
    cohort: 2024,
    studentId: "2024000001",
    personalEmail: "superadmin@tongclass.ac.cn",
    bio: "System seeded super admin account for local development.",
    researchInterests: ["Platform", "Operations"],
    titles: [{ title: "Platform Team", link: "https://tongclass.ac.cn" }],
    scholarUrl: "",
    orcidUrl: "",
    avatar: "",
    createdAt: now(),
    updatedAt: now(),
    password: "superadmin123",
    isEmailVerified: true,
  },
  {
    _id: "seed-admin",
    email: "admin@mails.tsinghua.edu.cn",
    username: "admin",
    englishName: "Site Admin",
    role: "admin",
    organization: "thu",
    cohort: 2024,
    studentId: "2024000002",
    personalEmail: "admin@tongclass.ac.cn",
    bio: "System seeded admin account for local development.",
    researchInterests: ["Content", "Operations"],
    titles: [{ title: "Content Team", link: "https://tongclass.ac.cn" }],
    scholarUrl: "",
    orcidUrl: "",
    avatar: "",
    createdAt: now(),
    updatedAt: now(),
    password: "admin12345",
    isEmailVerified: true,
  },
]

const emptyStore = (): AuthStore => ({
  users: [...seedUsers],
  currentUserId: null,
})

const hasWindow = () => typeof window !== "undefined"

const toAuthUser = (user: StoredUser): AuthUser => {
  const { password: _, ...rest } = user
  return rest
}

const readStore = (): AuthStore => {
  if (!hasWindow()) {
    return emptyStore()
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const initial = emptyStore()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }

  try {
    const parsed = JSON.parse(raw) as AuthStore
    if (!parsed.users || !Array.isArray(parsed.users)) {
      throw new Error("Invalid auth store format")
    }
    return parsed
  } catch {
    const initial = emptyStore()
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
}

const writeStore = (store: AuthStore) => {
  if (!hasWindow()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT))
}

const validateSchoolEmail = (organization: User["organization"], email: string, studentId: string) => {
  const normalized = email.toLowerCase()
  if (organization === "pku") {
    return normalized === `${studentId.toLowerCase()}@stu.pku.edu.cn`
  }

  const expectedThuDomains = ["@mails.tsinghua.edu.cn", "@tsinghua.edu.cn"]
  return (
    normalized.startsWith(`${studentId.toLowerCase()}@`) &&
    expectedThuDomains.some((domain) => normalized.endsWith(domain))
  )
}

export type RegisterInput = {
  email: string
  username: string
  englishName: string
  organization: User["organization"]
  cohort: number
  studentId: string
  password: string
  personalEmail?: string
  bio?: string
  researchInterests?: string[]
  titles?: { title: string; link: string }[]
}

type ManagedUserUpdates = Partial<
  Pick<
    User,
    | "email"
    | "username"
    | "englishName"
    | "organization"
    | "cohort"
    | "studentId"
    | "personalEmail"
    | "bio"
    | "researchInterests"
    | "titles"
    | "scholarUrl"
    | "orcidUrl"
    | "avatar"
    | "realPhoto"
    | "role"
  >
>

type ManagedUserCreateInput = Pick<
  User,
  "email" | "username" | "englishName" | "organization" | "cohort" | "studentId" | "role"
> & {
  password: string
}

export const register = (input: RegisterInput): { ok: true; user: AuthUser } | { ok: false; error: string } => {
  const store = readStore()

  const email = input.email.trim().toLowerCase()
  const username = input.username.trim().toLowerCase()
  const studentId = input.studentId.trim()

  if (!email || !username || !studentId) {
    return { ok: false, error: "Please complete all required fields." }
  }

  if (!validateSchoolEmail(input.organization, email, studentId)) {
    return { ok: false, error: "School email does not match organization and student ID." }
  }

  if (store.users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "This school email is already registered." }
  }
  if (store.users.some((u) => u.username.toLowerCase() === username)) {
    return { ok: false, error: "This username is already taken." }
  }
  if (store.users.some((u) => u.studentId === studentId)) {
    return { ok: false, error: "This student ID is already registered." }
  }

  const user: StoredUser = {
    _id: `user-${now()}`,
    email,
    username,
    englishName: input.englishName.trim(),
    role: "member",
    organization: input.organization,
    cohort: input.cohort,
    studentId,
    personalEmail: input.personalEmail?.trim() || undefined,
    bio: input.bio?.trim() || undefined,
    researchInterests: input.researchInterests?.filter(Boolean) || [],
    titles: input.titles?.filter((item) => item.title && item.link) || [],
    scholarUrl: "",
    orcidUrl: "",
    avatar: "",
    createdAt: now(),
    updatedAt: now(),
    password: input.password,
    isEmailVerified: true,
  }

  const next: AuthStore = {
    users: [...store.users, user],
    currentUserId: user._id,
  }
  writeStore(next)

  return { ok: true, user: toAuthUser(user) }
}

export const signIn = (
  identifier: string,
  password: string
): { ok: true; user: AuthUser } | { ok: false; error: string } => {
  const store = readStore()
  const normalized = identifier.trim().toLowerCase()

  const matched = store.users.find(
    (user) => user.email.toLowerCase() === normalized || user.username.toLowerCase() === normalized
  )

  if (!matched || matched.password !== password) {
    return { ok: false, error: "Invalid username/email or password." }
  }

  const next: AuthStore = {
    ...store,
    currentUserId: matched._id,
  }
  writeStore(next)

  return { ok: true, user: toAuthUser(matched) }
}

export const signOut = () => {
  const store = readStore()
  writeStore({
    ...store,
    currentUserId: null,
  })
}

export const getCurrentUser = (): AuthUser | null => {
  const store = readStore()
  const current = store.users.find((user) => user._id === store.currentUserId)
  return current ? toAuthUser(current) : null
}

export const getAllUsers = (): AuthUser[] => {
  const store = readStore()
  return store.users.map(toAuthUser)
}

export const getUserById = (userId: string): AuthUser | null => {
  const store = readStore()
  const user = store.users.find((item) => item._id === userId)
  return user ? toAuthUser(user) : null
}

export const createUserByAdmin = (
  input: ManagedUserCreateInput
): { ok: true; user: AuthUser } | { ok: false; error: string } => {
  const store = readStore()

  const email = input.email.trim().toLowerCase()
  const username = input.username.trim().toLowerCase()
  const studentId = input.studentId.trim()
  const englishName = input.englishName.trim()
  const password = input.password.trim()

  if (!email || !username || !studentId || !englishName || !password) {
    return { ok: false, error: "Please complete all required fields." }
  }

  if (!validateSchoolEmail(input.organization, email, studentId)) {
    return { ok: false, error: "School email does not match organization and student ID." }
  }

  if (store.users.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "This school email is already registered." }
  }
  if (store.users.some((u) => u.username.toLowerCase() === username)) {
    return { ok: false, error: "This username is already taken." }
  }
  if (store.users.some((u) => u.studentId === studentId)) {
    return { ok: false, error: "This student ID is already registered." }
  }

  const user: StoredUser = {
    _id: `user-${now()}`,
    email,
    username,
    englishName,
    role: input.role,
    organization: input.organization,
    cohort: input.cohort,
    studentId,
    personalEmail: undefined,
    bio: undefined,
    researchInterests: [],
    titles: [],
    scholarUrl: "",
    orcidUrl: "",
    avatar: "",
    createdAt: now(),
    updatedAt: now(),
    password,
    isEmailVerified: true,
  }

  writeStore({
    ...store,
    users: [...store.users, user],
  })

  return { ok: true, user: toAuthUser(user) }
}

export const updateUserById = (
  userId: string,
  updates: ManagedUserUpdates
): { ok: true; user: AuthUser } | { ok: false; error: string } => {
  const store = readStore()
  const index = store.users.findIndex((user) => user._id === userId)

  if (index < 0) {
    return { ok: false, error: "User not found." }
  }

  const email = updates.email?.trim().toLowerCase()
  const username = updates.username?.trim().toLowerCase()
  const studentId = updates.studentId?.trim()

  if (email && store.users.some((user, idx) => idx !== index && user.email.toLowerCase() === email)) {
    return { ok: false, error: "This school email is already registered." }
  }

  if (username && store.users.some((user, idx) => idx !== index && user.username.toLowerCase() === username)) {
    return { ok: false, error: "This username is already taken." }
  }

  if (studentId && store.users.some((user, idx) => idx !== index && user.studentId === studentId)) {
    return { ok: false, error: "This student ID is already registered." }
  }

  const users = [...store.users]
  users[index] = {
    ...users[index],
    ...updates,
    ...(email ? { email } : {}),
    ...(username ? { username } : {}),
    ...(studentId ? { studentId } : {}),
    updatedAt: now(),
  }

  const nextStore: AuthStore = {
    ...store,
    users,
  }
  writeStore(nextStore)

  return { ok: true, user: toAuthUser(users[index]) }
}

export const deleteUserById = (userId: string): { ok: true } | { ok: false; error: string } => {
  const store = readStore()
  const exists = store.users.some((user) => user._id === userId)

  if (!exists) {
    return { ok: false, error: "User not found." }
  }

  const users = store.users.filter((user) => user._id !== userId)
  if (users.length === 0) {
    return { ok: false, error: "Cannot delete all users." }
  }

  writeStore({
    users,
    currentUserId: store.currentUserId === userId ? null : store.currentUserId,
  })

  return { ok: true }
}

export const updateCurrentUser = (
  updates: Partial<
    Pick<
      User,
      | "englishName"
      | "personalEmail"
      | "bio"
      | "researchInterests"
      | "titles"
      | "scholarUrl"
      | "orcidUrl"
      | "avatar"
      | "realPhoto"
    >
  >
): { ok: true; user: AuthUser } | { ok: false; error: string } => {
  const store = readStore()
  const idx = store.users.findIndex((user) => user._id === store.currentUserId)

  if (idx < 0) {
    return { ok: false, error: "You are not logged in." }
  }

  const current = store.users[idx]
  const updated: StoredUser = {
    ...current,
    ...updates,
    updatedAt: now(),
  }

  const users = [...store.users]
  users[idx] = updated
  writeStore({
    ...store,
    users,
  })

  return { ok: true, user: toAuthUser(updated) }
}

export const changePassword = (
  currentPassword: string,
  nextPassword: string
): { ok: true } | { ok: false; error: string } => {
  const store = readStore()
  const idx = store.users.findIndex((user) => user._id === store.currentUserId)

  if (idx < 0) {
    return { ok: false, error: "You are not logged in." }
  }
  if (store.users[idx].password !== currentPassword) {
    return { ok: false, error: "Current password is incorrect." }
  }

  const users = [...store.users]
  users[idx] = {
    ...users[idx],
    password: nextPassword,
    updatedAt: now(),
  }

  writeStore({
    ...store,
    users,
  })

  return { ok: true }
}

export const subscribeAuth = (callback: () => void) => {
  if (!hasWindow()) return () => {}

  const handleChange = () => callback()
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      callback()
    }
  }

  window.addEventListener(AUTH_CHANGE_EVENT, handleChange)
  window.addEventListener("storage", handleStorage)
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, handleChange)
    window.removeEventListener("storage", handleStorage)
  }
}

export const roleCanManage = (actor: UserRole | null, target: UserRole) => {
  if (!actor) return false

  const level: Record<UserRole, number> = {
    member: 0,
    admin: 1,
    super_admin: 2,
  }

  return level[actor] > level[target]
}
