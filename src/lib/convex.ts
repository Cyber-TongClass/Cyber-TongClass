"use client"

import { ConvexReactClient } from "convex/react"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || ""

if (!convexUrl) {
  console.warn("NEXT_PUBLIC_CONVEX_URL is not set. Convex features may not work as expected.")
}

export const convex = new ConvexReactClient(convexUrl)
