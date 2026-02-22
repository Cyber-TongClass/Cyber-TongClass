"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"

// Users hooks
export function useUsers(args?: { skip?: number; limit?: number; organization?: "pku" | "thu"; cohort?: number }) {
  return useQuery(api.users.list, args || {})
}

export function useUserById(id: string) {
  return useQuery(api.users.getById, { id })
}

export function useUserByEmail(email: string) {
  return useQuery(api.users.getByEmail, { email })
}

export function useUserByStudentId(studentId: string) {
  return useQuery(api.users.getByStudentId, { studentId })
}

export function useUsersCount(organization?: "pku" | "thu") {
  return useQuery(api.users.count, { organization })
}

export function useSearchUsers(query: string) {
  return useQuery(api.users.search, { query })
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
  return useMutation(api.users.remove)
}
