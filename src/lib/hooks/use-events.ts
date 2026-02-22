"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/../convex/_generated/api"

// Events hooks
export function useEvents(args?: { skip?: number; limit?: number; fromDate?: string; toDate?: string }) {
  return useQuery(api.events.list, args || {})
}

export function useEventById(id: string) {
  return useQuery(api.events.getById, { id })
}

export function useEventsCount() {
  return useQuery(api.events.count)
}

export function useCreateEvent() {
  return useMutation(api.events.create)
}

export function useUpdateEvent() {
  return useMutation(api.events.update)
}

export function useDeleteEvent() {
  return useMutation(api.events.remove)
}
