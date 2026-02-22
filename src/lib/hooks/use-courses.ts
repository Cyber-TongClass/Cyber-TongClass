"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"

// Courses hooks
export function useCourses() {
  return useQuery(api.courses.list)
}

export function useCourseById(id: string) {
  return useQuery(api.courses.getById, { id })
}

export function useCourseByName(name: string) {
  return useQuery(api.courses.getByName, { name })
}

export function useCoursesCount() {
  return useQuery(api.courses.count)
}

export function useSearchCourses(query: string) {
  return useQuery(api.courses.search, { query })
}

export function useCreateCourse() {
  return useMutation(api.courses.create)
}

export function useUpdateCourse() {
  return useMutation(api.courses.update)
}

export function useDeleteCourse() {
  return useMutation(api.courses.remove)
}

// Course Reviews hooks
export function useCourseReviews(courseName: string, semester?: string) {
  return useQuery(api.courseReviews.listByCourse, { courseName, semester })
}

export function useAllCourseReviews(courseName: string, status?: "pending" | "approved" | "rejected") {
  return useQuery(api.courseReviews.listByCourseAll, { courseName, status })
}

export function usePendingReviews(args?: { skip?: number; limit?: number }) {
  return useQuery(api.courseReviews.listPending, args || {})
}

export function useCourseList() {
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
  return useMutation(api.courseReviews.remove)
}
