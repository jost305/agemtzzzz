"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  getUserRole: () => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === "SIGNED_IN" && session?.user) {
        const role = session.user.user_metadata?.role || "user"
        console.log("User signed in with role:", role)

        // Role-based redirects
        switch (role) {
          case "admin":
            router.push("/admin")
            break
          case "creator":
            router.push("/creator/dashboard")
            break
          default:
            router.push("/dashboard")
            break
        }

        toast.success("Signed in successfully!")
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out")
        router.push("/")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const getUserRole = () => {
    if (!user) return "guest"
    return user.user_metadata?.role || "user"
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        return { error: error.message }
      }

      if (data.user) {
        console.log("User signed in:", data.user.email, "Role:", data.user.user_metadata?.role)
        // Don't show toast here, it will be shown in the auth state change handler
        return {}
      }

      return { error: "Unknown error occurred" }
    } catch (error: any) {
      console.error("Sign in error:", error)
      return { error: error.message || "Failed to sign in" }
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        return { error: error.message }
      }

      toast.success("Account created successfully! Please check your email to verify your account.")
      return {}
    } catch (error: any) {
      console.error("Sign up error:", error)
      return { error: error.message || "Failed to create account" }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      toast.success("Signed out successfully!")
    } catch (error: any) {
      console.error("Sign out error:", error)
      toast.error(error.message || "Failed to sign out")
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      toast.success("Password reset email sent! Check your inbox.")
    } catch (error: any) {
      console.error("Reset password error:", error)
      toast.error(error.message || "Failed to send reset email")
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    getUserRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
