"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  Database,
  Globe,
  HardDrive,
  Shield,
  Wifi,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Server,
} from "lucide-react"
import SystemConfigurationService, { type SystemHealth } from "@/lib/system-config"

export function SystemHealthMonitor() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [logs, setLogs] = useState<
    Array<{
      timestamp: Date
      level: "info" | "warning" | "error"
      category: string
      message: string
      details?: any
    }>
  >([])

  const configService = SystemConfigurationService.getInstance()

  useEffect(() => {
    loadSystemHealth()
    loadSystemLogs()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadSystemHealth()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadSystemHealth = async () => {
    const healthData = configService.getSystemHealth()
    setHealth(healthData)
  }

  const loadSystemLogs = () => {
    const systemLogs = configService.getSystemLogs(50)
    setLogs(systemLogs)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadSystemHealth()
    loadSystemLogs()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getStatusColor = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return "text-primary"
      case "warning":
        return "text-secondary"
      case "critical":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-secondary" />
      case "critical":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getLogLevelColor = (level: "info" | "warning" | "error") => {
    switch (level) {
      case "info":
        return "bg-primary/10 text-primary"
      case "warning":
        return "bg-secondary/10 text-secondary"
      case "error":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getComponentIcon = (component: string) => {
    switch (component) {
      case "database":
        return <Database className="h-5 w-5" />
      case "api":
        return <Globe className="h-5 w-5" />
      case "storage":
        return <HardDrive className="h-5 w-5" />
      case "network":
        return <Wifi className="h-5 w-5" />
      case "security":
        return <Shield className="h-5 w-5" />
      default:
        return <Server className="h-5 w-5" />
    }
  }

  if (!health) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            <span className="ml-2">Loading system health...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Health */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                System Health Monitor
              </CardTitle>
              <CardDescription>Real-time system health and performance monitoring</CardDescription>
            </div>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-4xl font-bold text-primary mb-2">{health.overall}%</div>
              <div className="text-sm font-medium mb-2">Overall Health</div>
              <Progress value={health.overall} className="w-full" />
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-4xl font-bold mb-2">{health.uptime}%</div>
              <div className="text-sm font-medium mb-2">System Uptime</div>
              <div className="text-xs text-muted-foreground">Last 30 days</div>
            </div>

            <div className="text-center p-6 bg-muted/50 rounded-lg">
              <div className="text-4xl font-bold mb-2">
                <Clock className="h-8 w-8 mx-auto mb-2" />
              </div>
              <div className="text-sm font-medium mb-2">Last Check</div>
              <div className="text-xs text-muted-foreground">{health.lastCheck.toLocaleTimeString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Health */}
      <Card>
        <CardHeader>
          <CardTitle>Component Status</CardTitle>
          <CardDescription>Detailed health status of system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(health.components).map(([component, status]) => (
              <div key={component} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={getStatusColor(status.status)}>{getComponentIcon(component)}</div>
                  <div>
                    <div className="font-medium capitalize">{component}</div>
                    <div className="text-sm text-muted-foreground">{status.message}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{status.score}%</div>
                    <Progress value={status.score} className="w-20" />
                  </div>
                  {getStatusIcon(status.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Logs</CardTitle>
          <CardDescription>Latest system events and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                  <Badge className={getLogLevelColor(log.level)} variant="secondary">
                    {log.level.toUpperCase()}
                  </Badge>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{log.category}</span>
                      <span className="text-xs text-muted-foreground">{log.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{log.message}</div>
                    {log.details && (
                      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                        {JSON.stringify(log.details, null, 2)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
