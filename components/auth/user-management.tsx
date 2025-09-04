"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, UserPlus, Shield, Eye, Settings } from "lucide-react"
import { AuthService, type User } from "@/lib/auth"

interface UserManagementProps {
  isOpen: boolean
  onClose: () => void
}

export function UserManagement({ isOpen, onClose }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(AuthService.getInstance().getAllUsers())
  const authService = AuthService.getInstance()

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

  const handleToggleUserStatus = (userId: string, isActive: boolean) => {
    const success = authService.updateUserStatus(userId, isActive)
    if (success) {
      setUsers(authService.getAllUsers())
    }
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
            Manage user accounts, roles, and access permissions for the microgrid monitoring system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="grid grid-cols-3 gap-4 flex-1">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-sm font-medium">Administrators</p>
                      <p className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Operators</p>
                      <p className="text-2xl font-bold">{users.filter((u) => u.role === "operator").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-secondary" />
                    <div>
                      <p className="text-sm font-medium">Viewers</p>
                      <p className="text-2xl font-bold">{users.filter((u) => u.role === "viewer").length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button className="ml-4">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>Manage existing user accounts and their access levels.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)} variant="secondary">
                          <span className="mr-1">{getRoleIcon(user.role)}</span>
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell className="text-sm">{user.lastLogin.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.isActive}
                            onCheckedChange={(checked) => handleToggleUserStatus(user.id, checked)}
                          />
                          <span className="text-sm">{user.isActive ? "Active" : "Inactive"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
