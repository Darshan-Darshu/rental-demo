"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "user" | "owner" | "admin"

interface User {
  id: string
  email: string
  name: string
  phone: string
  role: UserRole
  aadharVerified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  address?: string
  aadharNumber?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => void
  isLoading: boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  phone: string
  role: UserRole
  aadharNumber?: string
  address?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const role: UserRole = email.includes("owner") ? "owner" : email.includes("admin") ? "admin" : "user"

      const mockUser: User = {
        id: "1",
        email,
        name: role === "owner" ? "Property Owner" : role === "admin" ? "Admin User" : "John Doe",
        phone: "+91 9876543210",
        role,
        aadharVerified: true,
        emailVerified: true,
        phoneVerified: true,
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        aadharVerified: false,
        emailVerified: false,
        phoneVerified: false,
        address: data.address,
        aadharNumber: data.aadharNumber,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
