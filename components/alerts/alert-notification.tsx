"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, BellRing, AlertTriangle, CheckCircle, Eye } from "lucide-react"
import AlertManagementService, { type Alert } from "@/lib/alert-system"
import type { User } from "@clerk/nextjs/server"

interface AlertNotificationProps {
  user: any // Change User to any to match Clerk's User object
  onOpenAlertCenter: () => void
}

export function AlertNotification({ user, onOpenAlertCenter }: AlertNotificationProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewAlerts, setHasNewAlerts] = useState(false)

  const alertService = AlertManagementService.getInstance()

  useEffect(() => {
    const unsubscribe = alertService.subscribe((newAlerts) => {
      const activeAlerts = newAlerts
        .filter((alert) => alert.status === "active" || alert.status === "acknowledged")
        .slice(0, 10) // Show only recent 10 alerts

      setAlerts(activeAlerts)

      // Check for new alerts (alerts created in the last 30 seconds)
      const recentAlerts = newAlerts.filter(
        (alert) => alert.status === "active" && Date.now() - alert.timestamp.getTime() < 30000,
      )

      if (recentAlerts.length > 0) {
        setHasNewAlerts(true)
        // Auto-clear the new alert indicator after 10 seconds
        setTimeout(() => setHasNewAlerts(false), 10000)
      }
    })

    return unsubscribe
  }, [])

  const getSeverityColor = (severity: Alert["severity"]) => {
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

  const getStatusIcon = (status: Alert["status"]) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-3 w-3 text-destructive" />
      case "acknowledged":
        return <Eye className="h-3 w-3 text-secondary" />
      case "resolved":
        return <CheckCircle className="h-3 w-3 text-primary" />
      default:
        return null
    }
  }

  const handleQuickAcknowledge = (alertId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    alertService.acknowledgeAlert(alertId, user.emailAddresses[0].emailAddress)
  }

  const activeAlertsCount = alerts.filter((alert) => alert.status === "active").length
  const criticalAlertsCount = alerts.filter(
    (alert) => alert.status === "active" && alert.severity === "critical",
  ).length

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {hasNewAlerts ? (
            <BellRing className="h-5 w-5 text-destructive animate-pulse" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {activeAlertsCount > 0 && (
            <Badge
              className={`absolute -top-1 -right-1 h-5 w-5 p-0 text-xs ${criticalAlertsCount > 0
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-secondary text-secondary-foreground"
                }`}
              variant="secondary"
            >
              {activeAlertsCount > 9 ? "9+" : activeAlertsCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">System Alerts</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false)
                onOpenAlertCenter()
              }}
            >
              View All
            </Button>
          </div>
          {activeAlertsCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {activeAlertsCount} active alert{activeAlertsCount !== 1 ? "s" : ""}
              {criticalAlertsCount > 0 && (
                <span className="text-destructive font-medium"> • {criticalAlertsCount} critical</span>
              )}
            </p>
          )}
        </div>

        <ScrollArea className="h-80">
          {alerts.length === 0 ? (
            <div className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No active alerts</p>
            </div>
          ) : (
            <div className="p-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer border-l-4 border-l-transparent hover:border-l-primary mb-2"
                  onClick={() => {
                    setIsOpen(false)
                    onOpenAlertCenter()
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">{getStatusIcon(alert.status)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium truncate">{alert.title}</p>
                        <Badge className={getSeverityColor(alert.severity)} variant="secondary">
                          {alert.severity}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{alert.message}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{alert.timestamp.toLocaleTimeString()}</span>

                        {alert.status === "active" && user.role !== "viewer" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => handleQuickAcknowledge(alert.id, e)}
                          >
                            <Eye className="mr-1 h-3 w-3" />
                            Ack
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {activeAlertsCount > 0 && (
          <div className="p-3 border-t bg-muted/30">
            <Button
              className="w-full"
              size="sm"
              onClick={() => {
                setIsOpen(false)
                onOpenAlertCenter()
              }}
            >
              Manage All Alerts
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
