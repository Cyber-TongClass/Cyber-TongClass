"use client"

import { ReactNode } from "react"
import { convex } from "./convex"
import { ConvexProvider } from "convex/react"

export { convex }

export function ConvexAuthClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  )
}
