"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import type { UserRole } from "@/types"

export function useAuth() {
  const router = useRouter()
  const [storedEmail, setStoredEmail] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [queryTimedOut, setQueryTimedOut] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isPending, startTransition] = useTransition()
  
  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("tongclass_user_email")
      setStoredEmail(email)
      setIsInitialized(true)
    }
  }, [])
  
  // Query user by email from localStorage
  const userData = useQuery(
    api.users.getByEmail,
    storedEmail ? { email: storedEmail } : "skip"
  )

  useEffect(() => {
    if (!isInitialized || storedEmail === null || userData !== undefined) {
      setQueryTimedOut(false)
      return
    }

    const timer = window.setTimeout(() => {
      setQueryTimedOut(true)
    }, 4000)

    return () => window.clearTimeout(timer)
  }, [isInitialized, storedEmail, userData])
  
  // Force refetch when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0 && storedEmail) {
      // Trigger a re-render to refresh the query
      setRefreshKey(0)
    }
  }, [refreshKey, storedEmail])
  
  const isUserQueryPending = storedEmail !== null && userData === undefined && !queryTimedOut
  const currentUser = storedEmail && !isUserQueryPending ? userData || null : null
  
  // Get user role
  const currentRole = currentUser?.role ?? null
  
  // Convert to loading state
  const isLoading = !isInitialized || isUserQueryPending || isPending

  // Login mutation
  const loginMutation = useMutation(api.users.simpleLogin)

  const login = useCallback(async (identifier: string, password: string) => {
    try {
      const result = await loginMutation({ 
        email: identifier, 
        password: password 
      })
      
      if (result && "email" in result && result.email) {
        // Store email in localStorage for session persistence
        localStorage.setItem("tongclass_user_email", result.email)
        
        // Update state
        startTransition(() => {
          setStoredEmail(result.email!)
          setRefreshKey(k => k + 1)
        })
        
        return { ok: true, user: result }
      }
      return { ok: false, error: "登录失败" }
    } catch (error: unknown) {
      const err = error as { message?: string }
      return { ok: false, error: err.message || "登录失败" }
    }
  }, [loginMutation])

  const logout = useCallback(async () => {
    localStorage.removeItem("tongclass_user_email")
    localStorage.removeItem("tongclass_user_id")
    setStoredEmail(null)
    router.push("/")
    router.refresh()
  }, [router])

  // Determine admin status from user data
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "super_admin"
  const isSuperAdmin = currentUser?.role === "super_admin"

  return {
    currentUser,
    currentRole,
    isAdmin,
    isSuperAdmin,
    isLoading,
    isAuthenticated: !!currentUser,
    logout,
    login,
    isStudentIdAllowed: async () => true,
  }
}

export function useRole(requiredRole: UserRole) {
  const { currentRole } = useAuth()

  if (requiredRole === "super_admin") {
    return currentRole === "super_admin"
  }
  if (requiredRole === "admin") {
    return currentRole === "admin" || currentRole === "super_admin"
  }
  return !!currentRole
}

export function useCanManage(targetRole: UserRole) {
  const { currentRole } = useAuth()

  const roleCanManage = useCallback((actor: UserRole | null, target: UserRole) => {
    if (!actor) return false

    const level: Record<UserRole, number> = {
      member: 0,
      admin: 1,
      super_admin: 2,
    }

    return level[actor] > level[target]
  }, [])

  return useMemo(() => roleCanManage(currentRole, targetRole), [currentRole, targetRole, roleCanManage])
}
