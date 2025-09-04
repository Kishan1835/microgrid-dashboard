export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "operator" | "viewer"
  department: string
  lastLogin: Date
  isActive: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock users for demonstration (in production, this would come from a secure database)
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@energy.gov",
    name: "System Administrator",
    role: "admin",
    department: "IT Operations",
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "2",
    email: "operator@energy.gov",
    name: "Grid Operator",
    role: "operator",
    department: "Grid Operations",
    lastLogin: new Date(),
    isActive: true,
  },
  {
    id: "3",
    email: "viewer@energy.gov",
    name: "Energy Analyst",
    role: "viewer",
    department: "Analytics",
    lastLogin: new Date(),
    isActive: true,
  },
]

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In production, this would validate against a secure backend
    const user = mockUsers.find((u) => u.email === email && u.isActive)

    if (user && password === "government123") {
      // Demo password
      this.currentUser = { ...user, lastLogin: new Date() }
      localStorage.setItem("auth_user", JSON.stringify(this.currentUser))
      return { success: true, user: this.currentUser }
    }

    return { success: false, error: "Invalid credentials or inactive account" }
  }

  logout(): void {
    this.currentUser = null
    localStorage.removeItem("auth_user")
  }

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    const stored = localStorage.getItem("auth_user")
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored)
        return this.currentUser
      } catch {
        localStorage.removeItem("auth_user")
      }
    }
    return null
  }

  hasPermission(requiredRole: User["role"]): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    const roleHierarchy = { admin: 3, operator: 2, viewer: 1 }
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  }

  getAllUsers(): User[] {
    return mockUsers
  }

  updateUserStatus(userId: string, isActive: boolean): boolean {
    const userIndex = mockUsers.findIndex((u) => u.id === userId)
    if (userIndex !== -1) {
      mockUsers[userIndex].isActive = isActive
      return true
    }
    return false
  }
}
