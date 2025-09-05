"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, Settings, Shield } from "lucide-react"
import { UserButton, useUser } from "@clerk/nextjs"

interface UserMenuProps {
  user: any // Change UserType to any as Clerk user object is different
  onLogout: () => void
  onOpenUserManagement?: () => void
}

export function UserMenu({ user, onLogout, onOpenUserManagement }: UserMenuProps) {
  const { user: clerkUser } = useUser()

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive text-destructive-foreground"
      case "operator":
        return "bg-primary text-primary-foreground"
      case "viewer":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (!clerkUser) return null

  return (
    <div className="flex items-center gap-3">
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
