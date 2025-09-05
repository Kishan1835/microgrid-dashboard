"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, UserPlus, Shield, Eye, Settings } from "lucide-react"
import { useUser } from "@clerk/nextjs"

interface UserManagementProps {
  isOpen: boolean
  onClose: () => void
}

export function UserManagement({ isOpen, onClose }: UserManagementProps) {
  const { user } = useUser()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "operator":
        return <Settings className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return null
    }
  }

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

  if (user?.publicMetadata?.role !== "admin") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-destructive" />
              Access Denied
            </DialogTitle>
            <DialogDescription>
              You do not have administrative privileges to access user management.
            </DialogDescription>
          </DialogHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Only administrators can manage user accounts. Please contact your system administrator.
              </p>
            </div>
          </CardContent>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </DialogTitle>
          <DialogDescription>
            User management is handled through the Clerk Dashboard. Click the button below to access it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center">
              <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">Manage Users in Clerk Dashboard</h3>
              <p className="text-muted-foreground mb-4">
                To add, edit, or remove users, and manage their roles and permissions, please visit the Clerk Dashboard.
              </p>
              <Button
                onClick={() => window.open("https://dashboard.clerk.com/", "_blank")}
                className="mt-4"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Go to Clerk Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current User Role (Clerk)</CardTitle>
              <CardDescription>Your current role as detected by Clerk.</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge className={getRoleColor(user?.publicMetadata?.role as string)} variant="secondary">
                <span className="mr-1">{getRoleIcon(user?.publicMetadata?.role as string)}</span>
                {(user?.publicMetadata?.role as string)?.toUpperCase() || "N/A"}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">This application uses Clerk for user authentication and role management.</p>
            </CardContent>
          </Card>

          {/* Removed previous mock user list and related functionalities */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
