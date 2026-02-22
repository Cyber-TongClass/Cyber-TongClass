"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"

// News hooks
export function useNews(args?: { skip?: number; limit?: number; category?: string }) {
  return useQuery(api.news.list, args || {})
}

export function useAllNews(args?: { skip?: number; limit?: number; category?: string }) {
  return useQuery(api.news.listAll, args || {})
}

export function useNewsById(id: string) {
  return useQuery(api.news.getById, { id })
}

export function useNewsCount(category?: string) {
  return useQuery(api.news.count, { category })
}

export function useCreateNews() {
  return useMutation(api.news.create)
}

export function useUpdateNews() {
  return useMutation(api.news.update)
}

export function useDeleteNews() {
  return useMutation(api.news.remove)
}
