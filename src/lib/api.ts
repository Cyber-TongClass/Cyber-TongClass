"use client"

import { useCallback } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

type IdLike =
  | string
  | {
      id: string | { __id?: string }
    }
  | { __id?: string }

const toIdArg = (input: IdLike) => {
  if (typeof input === "string") {
    return { id: input as any }
  }

  if (input && typeof input === "object" && "id" in input) {
    const rawId = (input as any).id
    if (rawId && typeof rawId === "object" && "__id" in rawId) {
      return { id: (rawId as any).__id as any }
    }
    return { id: rawId as any }
  }

  if (input && typeof input === "object" && "__id" in input) {
    return { id: (input as any).__id as any }
  }

  return { id: input as any }
}

// ==================== 认证相关 ====================

export function useCurrentUser() {
  return useQuery(api.auth.currentUser)
}

export function useCurrentUserRole() {
  return useQuery(api.auth.currentUserRole)
}

export function useIsAdmin() {
  return useQuery(api.auth.isAdmin)
}

export function useIsSuperAdmin() {
  return useQuery(api.auth.isSuperAdmin)
}

type SignUpInput = {
  email: string
  username: string
  englishName: string
  organization: "pku" | "thu"
  cohort: number
  studentId: string
  password: string
  personalEmail?: string
  bio?: string
  researchInterests?: string[]
  titles?: { title: string; link: string }[]
  scholarUrl?: string
  orcidUrl?: string
  avatar?: string
}

export function useSignUp() {
  const createUser = useMutation(api.users.create)

  return useCallback(
    async (input: SignUpInput) => {
      return createUser({
        email: input.email,
        username: input.username,
        englishName: input.englishName,
        organization: input.organization,
        cohort: input.cohort,
        studentId: input.studentId,
        password: input.password,
        personalEmail: input.personalEmail,
        bio: input.bio,
        researchInterests: input.researchInterests,
        titles: input.titles,
        scholarUrl: input.scholarUrl,
        orcidUrl: input.orcidUrl,
        avatar: input.avatar,
      } as any)
    },
    [createUser]
  )
}

type SignInInput = {
  email: string
  password: string
}

export function useSignIn() {
  const login = useMutation(api.users.simpleLogin)

  return useCallback(
    async (input: SignInInput) => {
      const result = await login({
        email: input.email,
        password: input.password,
      } as any)

      if (!result) {
        return { success: false }
      }

      return {
        ...(result as any),
        success: true,
      }
    },
    [login]
  )
}

// ==================== 用户相关 ====================

export function useUsers(args?: { organization?: "pku" | "thu"; cohort?: number; skip?: number; limit?: number }) {
  return useQuery(api.users.list, args || {})
}

export function useUserById(id?: string | null) {
  return useQuery(api.users.getById, id ? ({ id: id as any } as any) : "skip")
}

export function useCreateUser() {
  return useMutation(api.users.create)
}

export function useUpdateUser() {
  return useMutation(api.users.update)
}

export function useUpdateUserRole() {
  return useMutation(api.users.updateRole)
}

export function useDeleteUser() {
  const remove = useMutation(api.users.remove)
  return useCallback((input: IdLike) => remove(toIdArg(input) as any), [remove])
}

export function useSimpleLogin() {
  return useMutation(api.users.simpleLogin)
}

export function useUsersCount(args?: { organization?: "pku" | "thu" }) {
  return useQuery(api.users.count, args || {})
}

// ==================== 新闻相关 ====================

export function useNews(args?: { category?: string; skip?: number; limit?: number }) {
  return useQuery(api.news.list, args || {})
}

export function useAllNews(args?: { category?: string; skip?: number; limit?: number }) {
  return useQuery(api.news.listAll, args || {})
}

export function useNewsById(id?: string | null) {
  return useQuery(api.news.getById, id ? ({ id: id as any } as any) : "skip")
}

export function useCreateNews() {
  return useMutation(api.news.create)
}

export function useUpdateNews() {
  return useMutation(api.news.update)
}

export function useDeleteNews() {
  const remove = useMutation(api.news.remove)
  return useCallback((input: IdLike) => remove(toIdArg(input) as any), [remove])
}

export function useNewsCount(args?: { category?: string }) {
  return useQuery(api.news.count, args || {})
}

// ==================== 活动相关 ====================

export function useEvents(args?: { fromDate?: string; toDate?: string; skip?: number; limit?: number }) {
  return useQuery(api.events.list, args || {})
}

export function useEventById(id?: string | null) {
  return useQuery(api.events.getById, id ? ({ id: id as any } as any) : "skip")
}

export function useCreateEvent() {
  return useMutation(api.events.create)
}

export function useUpdateEvent() {
  return useMutation(api.events.update)
}

export function useDeleteEvent() {
  const remove = useMutation(api.events.remove)
  return useCallback((input: IdLike) => remove(toIdArg(input) as any), [remove])
}

export function useEventsCount() {
  return useQuery(api.events.count)
}

// ==================== 出版物相关 ====================

export function usePublications(args?: { category?: string; year?: number; skip?: number; limit?: number }) {
  return useQuery(api.publications.list, args || {})
}

export function usePublicationsByUser(userId?: string | null) {
  return useQuery(api.publications.listByUser, userId ? ({ userId: userId as any } as any) : "skip")
}

export function usePublicationById(id?: string | null) {
  return useQuery(api.publications.getById, id ? ({ id: id as any } as any) : "skip")
}

export function useCreatePublication() {
  return useMutation(api.publications.create)
}

export function useUpdatePublication() {
  return useMutation(api.publications.update)
}

export function useDeletePublication() {
  const remove = useMutation(api.publications.remove)
  return useCallback((input: IdLike) => remove(toIdArg(input) as any), [remove])
}

export function usePublicationsCount(args?: { category?: string; year?: number }) {
  return useQuery(api.publications.count, args || {})
}

export function useSearchPublications(query: string) {
  return useQuery(api.publications.search, query ? { query } : "skip")
}

// ==================== 课程相关 ====================

export function useCourses(args?: { skip?: number; limit?: number }) {
  return useQuery(api.courses.list, args || {})
}

export function useCourseById(id?: string | null) {
  return useQuery(api.courses.getById, id ? ({ id: id as any } as any) : "skip")
}

export function useCourseByName(name?: string | null) {
  return useQuery(api.courses.getByName, name ? { name } : "skip")
}

export function useCreateCourse() {
  return useMutation(api.courses.create)
}

export function useUpdateCourse() {
  return useMutation(api.courses.update)
}

export function useDeleteCourse() {
  const remove = useMutation(api.courses.remove)
  return useCallback((input: IdLike) => remove(toIdArg(input) as any), [remove])
}

// ==================== 课程评价相关 ====================

export function useCourseReviews(args?: string | { courseName?: string; semester?: string }) {
  const normalized =
    typeof args === "string"
      ? {
          courseName: args,
        }
      : args

  return useQuery(api.courseReviews.listByCourse, normalized?.courseName ? (normalized as any) : "skip")
}

export function useAllCourseReviews(args?: {
  courseName?: string
  status?: "pending" | "approved" | "rejected"
}) {
  return useQuery(api.courseReviews.listByCourseAll, args || {})
}

export function usePendingReviews(args?: { skip?: number; limit?: number }) {
  return useQuery(api.courseReviews.listPending, args || {})
}

export function useCourseListWithReviews() {
  return useQuery(api.courseReviews.listCourses)
}

export function useCreateCourseReview() {
  return useMutation(api.courseReviews.create)
}

export function useUpdateCourseReview() {
  return useMutation(api.courseReviews.update)
}

export function useApproveCourseReview() {
  return useMutation(api.courseReviews.approve)
}

export function useRejectCourseReview() {
  return useMutation(api.courseReviews.reject)
}

export function useDeleteCourseReview() {
  const remove = useMutation(api.courseReviews.remove)
  return useCallback((input: IdLike) => remove(toIdArg(input) as any), [remove])
}

// ==================== 认证操作 ====================

export function useGetUserByEmail(email: string) {
  return useQuery(api.auth.getUserByEmail, email ? { email } : "skip")
}
