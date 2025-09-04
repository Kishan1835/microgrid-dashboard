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
import { AuthService, type User as UserType } from "@/lib/auth"

interface UserMenuProps {
  user: UserType
  onLogout: () => void
  onOpenUserManagement?: () => void
}

export function UserMenu({ user, onLogout, onOpenUserManagement }: UserMenuProps) {
  const authService = AuthService.getInstance()

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <Badge className={getRoleColor(user.role)} variant="secondary">
                {user.role.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.department}</p>
            <p className="text-xs leading-none text-muted-foreground">Last login: {user.lastLogin.toLocaleString()}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {authService.hasPermission("admin") && onOpenUserManagement && (
          <DropdownMenuItem onClick={onOpenUserManagement}>
            <Shield className="mr-2 h-4 w-4" />
            <span>User Management</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
