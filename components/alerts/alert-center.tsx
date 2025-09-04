"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Clock, Filter, Bell, Eye, EyeOff, Settings, BarChart3, Zap } from "lucide-react"
import AlertManagementService, { type Alert as SystemAlert, type AlertMetrics } from "@/lib/alert-system"
import type { User } from "@/lib/auth"

interface AlertCenterProps {
  user: User
}

export function AlertCenter({ user }: AlertCenterProps) {
  const [alerts, setAlerts] = useState<SystemAlert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<SystemAlert[]>([])
  const [metrics, setMetrics] = useState<AlertMetrics | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("alerts")

  const alertService = AlertManagementService.getInstance()

  useEffect(() => {
    const unsubscribe = alertService.subscribe((newAlerts) => {
      setAlerts(newAlerts)
      setMetrics(alertService.getAlertMetrics())
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    let filtered = alerts

    if (statusFilter !== "all") {
      filtered = filtered.filter((alert) => alert.status === statusFilter)
    }
    if (severityFilter !== "all") {
      filtered = filtered.filter((alert) => alert.severity === severityFilter)
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter((alert) => alert.category === categoryFilter)
    }

    setFilteredAlerts(filtered)
  }, [alerts, statusFilter, severityFilter, categoryFilter])

  const getSeverityColor = (severity: SystemAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-destructive/80 text-destructive-foreground"
      case "medium":
        return "bg-secondary text-secondary-foreground"
      case "low":
        return "bg-muted text-muted-foreground"
      case "info":
        return "bg-primary/20 text-primary"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: SystemAlert["status"]) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "acknowledged":
        return <Eye className="h-4 w-4 text-secondary" />
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "dismissed":
        return <EyeOff className="h-4 w-4 text-muted-foreground" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleAcknowledge = (alertId: string) => {
    alertService.acknowledgeAlert(alertId, user.email)
  }

  const handleResolve = (alertId: string) => {
    alertService.resolveAlert(alertId, user.email)
  }

  const handleDismiss = (alertId: string) => {
    alertService.dismissAlert(alertId)
  }

  const canManageAlerts = user.role === "admin" || user.role === "operator"

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alert Management Center
          </CardTitle>
          <CardDescription>Monitor, acknowledge, and resolve system alerts and notifications</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Active Alerts
          </TabsTrigger>
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Metrics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Alert Metrics Summary */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Active Alerts</span>
                  </div>
                  <div className="text-2xl font-bold text-destructive">{metrics.activeAlerts}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">Critical</span>
                  </div>
                  <div className="text-2xl font-bold text-destructive">{metrics.criticalAlerts}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Avg Resolution</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">{metrics.averageResolutionTime.toFixed(0)}m</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Acknowledged</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">{metrics.acknowledgedRate.toFixed(0)}%</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Severity</label>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="environmental">Environmental</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert List */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts ({filteredAlerts.length})</CardTitle>
              <CardDescription>Recent system alerts and notifications requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">No alerts match the current filters</p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <Alert key={alert.id} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{getStatusIcon(alert.status)}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTitle className="text-base font-semibold">{alert.title}</AlertTitle>
                            <Badge className={getSeverityColor(alert.severity)} variant="secondary">
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{alert.category}</Badge>
                          </div>

                          <AlertDescription className="mb-3">{alert.message}</AlertDescription>

                          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span>Source: {alert.source}</span>
                              <span>Time: {alert.timestamp.toLocaleString()}</span>
                              {alert.acknowledgedBy && <span>Acknowledged by: {alert.acknowledgedBy}</span>}
                              {alert.resolvedBy && <span>Resolved by: {alert.resolvedBy}</span>}
                            </div>

                            {alert.affectedSystems.length > 0 && (
                              <div>Affected Systems: {alert.affectedSystems.join(", ")}</div>
                            )}
                          </div>

                          {alert.recommendedActions.length > 0 && (
                            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                              <div className="text-sm font-medium mb-2">Recommended Actions:</div>
                              <ul className="text-sm text-muted-foreground space-y-1">
                                {alert.recommendedActions.map((action, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {canManageAlerts && (
                          <div className="flex-shrink-0 flex flex-col gap-2">
                            {alert.status === "active" && (
                              <Button size="sm" variant="outline" onClick={() => handleAcknowledge(alert.id)}>
                                <Eye className="mr-2 h-3 w-3" />
                                Acknowledge
                              </Button>
                            )}

                            {(alert.status === "active" || alert.status === "acknowledged") && (
                              <Button size="sm" onClick={() => handleResolve(alert.id)}>
                                <CheckCircle className="mr-2 h-3 w-3" />
                                Resolve
                              </Button>
                            )}

                            {alert.status !== "dismissed" && (
                              <Button size="sm" variant="ghost" onClick={() => handleDismiss(alert.id)}>
                                <EyeOff className="mr-2 h-3 w-3" />
                                Dismiss
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </Alert>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          {metrics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Alerts by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(metrics.alertsByCategory).map(([category, count]) => (
                        <div key={category} className="flex items-center justify-between">
                          <span className="capitalize">{category}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alerts by Severity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(metrics.alertsBySeverity).map(([severity, count]) => (
                        <div key={severity} className="flex items-center justify-between">
                          <span className="capitalize">{severity}</span>
                          <Badge className={getSeverityColor(severity as SystemAlert["severity"])} variant="secondary">
                            {count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{metrics.totalAlerts}</div>
                    <div className="text-sm text-muted-foreground">Total Alerts</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-secondary mb-2">{metrics.escalationRate.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Escalation Rate</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {metrics.averageResolutionTime.toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Avg Resolution (min)</div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Configuration</CardTitle>
              <CardDescription>Configure alert rules, thresholds, and notification settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Alert configuration interface would be implemented here for administrators
                </p>
                {user.role === "admin" && (
                  <Button className="mt-4 bg-transparent" variant="outline">
                    Configure Alert Rules
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
