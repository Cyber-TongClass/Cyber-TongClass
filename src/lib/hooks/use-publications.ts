"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"

// Publications hooks
export function usePublications(args?: { skip?: number; limit?: number; category?: string; year?: number }) {
  return useQuery(api.publications.list, args || {})
}

export function usePublicationsByUser(userId: string) {
  return useQuery(api.publications.listByUser, { userId })
}

export function usePublicationById(id: string) {
  return useQuery(api.publications.getById, { id })
}

export function usePublicationsCount(args?: { category?: string; year?: number }) {
  return useQuery(api.publications.count, args || {})
}

export function useSearchPublications(query: string) {
  return useQuery(api.publications.search, { query })
}

export function useCreatePublication() {
  return useMutation(api.publications.create)
}

export function useUpdatePublication() {
  return useMutation(api.publications.update)
}

export function useDeletePublication() {
  return useMutation(api.publications.remove)
}
