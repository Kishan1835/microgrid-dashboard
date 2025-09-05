import type { User } from "@clerk/nextjs/server"

export interface Alert {
  id: string
  title: string
  message: string
  severity: "critical" | "high" | "medium" | "low" | "info"
  category: "system" | "performance" | "maintenance" | "security" | "environmental" | "compliance"
  source: string
  timestamp: Date
  status: "active" | "acknowledged" | "resolved" | "dismissed"
  acknowledgedBy?: string
  acknowledgedAt?: Date
  resolvedBy?: string
  resolvedAt?: Date
  escalationLevel: number
  affectedSystems: string[]
  recommendedActions: string[]
  metadata: Record<string, any>
}

export interface AlertRule {
  id: string
  name: string
  description: string
  category: Alert["category"]
  severity: Alert["severity"]
  condition: {
    metric: string
    operator: ">" | "<" | "=" | ">=" | "<=" | "!="
    threshold: number
    duration?: number // minutes
  }
  enabled: boolean
  escalationRules: {
    level: number
    delayMinutes: number
    recipients: string[]
    channels: ("email" | "sms" | "dashboard" | "webhook")[]
  }[]
  createdBy: string
  createdAt: Date
  lastTriggered?: Date
}

export interface NotificationChannel {
  id: string
  type: "email" | "sms" | "dashboard" | "webhook"
  name: string
  config: Record<string, any>
  enabled: boolean
  recipients: string[]
}

export interface AlertMetrics {
  totalAlerts: number
  activeAlerts: number
  criticalAlerts: number
  averageResolutionTime: number
  alertsByCategory: Record<string, number>
  alertsBySeverity: Record<string, number>
  escalationRate: number
  acknowledgedRate: number
}

class AlertManagementService {
  private static instance: AlertManagementService
  private alerts: Alert[] = []
  private alertRules: AlertRule[] = []
  private notificationChannels: NotificationChannel[] = []
  private subscribers: ((alerts: Alert[]) => void)[] = []

  static getInstance(): AlertManagementService {
    if (!AlertManagementService.instance) {
      AlertManagementService.instance = new AlertManagementService()
    }
    return AlertManagementService.instance
  }

  constructor() {
    this.initializeDefaultRules()
    this.initializeDefaultChannels()
    this.generateMockAlerts()
    this.startAlertMonitoring()
  }

  private initializeDefaultRules(): void {
    this.alertRules = [
      {
        id: "rule-1",
        name: "High System Temperature",
        description: "Alert when system temperature exceeds safe operating limits",
        category: "system",
        severity: "high",
        condition: {
          metric: "temperature",
          operator: ">",
          threshold: 35,
          duration: 5,
        },
        enabled: true,
        escalationRules: [
          {
            level: 1,
            delayMinutes: 0,
            recipients: ["operator@energy.gov"],
            channels: ["dashboard", "email"],
          },
          {
            level: 2,
            delayMinutes: 15,
            recipients: ["supervisor@energy.gov"],
            channels: ["email", "sms"],
          },
        ],
        createdBy: "system",
        createdAt: new Date(),
      },
      {
        id: "rule-2",
        name: "Low Battery Level",
        description: "Alert when battery level drops below critical threshold",
        category: "system",
        severity: "critical",
        condition: {
          metric: "batteryLevel",
          operator: "<",
          threshold: 15,
          duration: 2,
        },
        enabled: true,
        escalationRules: [
          {
            level: 1,
            delayMinutes: 0,
            recipients: ["operator@energy.gov", "admin@energy.gov"],
            channels: ["dashboard", "email", "sms"],
          },
        ],
        createdBy: "system",
        createdAt: new Date(),
      },
      {
        id: "rule-3",
        name: "System Efficiency Drop",
        description: "Alert when system efficiency drops below acceptable levels",
        category: "performance",
        severity: "medium",
        condition: {
          metric: "efficiency",
          operator: "<",
          threshold: 80,
          duration: 10,
        },
        enabled: true,
        escalationRules: [
          {
            level: 1,
            delayMinutes: 0,
            recipients: ["operator@energy.gov"],
            channels: ["dashboard"],
          },
          {
            level: 2,
            delayMinutes: 30,
            recipients: ["maintenance@energy.gov"],
            channels: ["email"],
          },
        ],
        createdBy: "system",
        createdAt: new Date(),
      },
    ]
  }

  private initializeDefaultChannels(): void {
    this.notificationChannels = [
      {
        id: "channel-1",
        type: "email",
        name: "Primary Email",
        config: { smtpServer: "mail.energy.gov", port: 587 },
        enabled: true,
        recipients: ["operator@energy.gov", "admin@energy.gov", "supervisor@energy.gov"],
      },
      {
        id: "channel-2",
        type: "sms",
        name: "Emergency SMS",
        config: { provider: "government-sms-gateway" },
        enabled: true,
        recipients: ["+1-555-0101", "+1-555-0102"],
      },
      {
        id: "channel-3",
        type: "dashboard",
        name: "Dashboard Notifications",
        config: {},
        enabled: true,
        recipients: ["all-users"],
      },
    ]
  }

  private generateMockAlerts(): void {
    const mockAlerts: Alert[] = [
      {
        id: "alert-1",
        title: "High Energy Consumption Detected",
        message: "Energy consumption has exceeded normal levels by 15% for the past 10 minutes",
        severity: "medium",
        category: "performance",
        source: "Consumption Monitor",
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        status: "active",
        escalationLevel: 1,
        affectedSystems: ["Grid Connection", "Load Balancer"],
        recommendedActions: [
          "Check for unusual load patterns",
          "Verify grid connection stability",
          "Review recent system changes",
        ],
        metadata: { consumptionLevel: 2847, threshold: 2400 },
      },
      {
        id: "alert-2",
        title: "Wind Turbine Maintenance Required",
        message: "Wind Turbine Unit 2 showing decreased efficiency and requires scheduled maintenance",
        severity: "low",
        category: "maintenance",
        source: "Wind Generation System",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        status: "acknowledged",
        acknowledgedBy: "operator@energy.gov",
        acknowledgedAt: new Date(Date.now() - 30 * 60 * 1000),
        escalationLevel: 1,
        affectedSystems: ["Wind Turbine Unit 2"],
        recommendedActions: [
          "Schedule maintenance window",
          "Order replacement parts if needed",
          "Notify maintenance team",
        ],
        metadata: { turbineId: "WT-002", efficiency: 82 },
      },
      {
        id: "alert-3",
        title: "Solar Panel Efficiency Drop",
        message: "Solar panel array C showing 8% efficiency drop, possible cleaning or maintenance needed",
        severity: "medium",
        category: "maintenance",
        source: "Solar Generation System",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: "resolved",
        acknowledgedBy: "operator@energy.gov",
        acknowledgedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        resolvedBy: "maintenance@energy.gov",
        resolvedAt: new Date(Date.now() - 30 * 60 * 1000),
        escalationLevel: 1,
        affectedSystems: ["Solar Array C"],
        recommendedActions: ["Clean solar panels", "Check for physical damage", "Verify electrical connections"],
        metadata: { arrayId: "SA-C", efficiencyDrop: 8 },
      },
    ]

    this.alerts = mockAlerts
  }

  private startAlertMonitoring(): void {
    // Simulate real-time alert monitoring
    setInterval(() => {
      this.checkAlertConditions()
    }, 30000) // Check every 30 seconds
  }

  private checkAlertConditions(): void {
    // In a real implementation, this would check actual system metrics
    // For demo purposes, we'll occasionally generate new alerts
    if (Math.random() < 0.1) {
      // 10% chance every 30 seconds
      this.generateRandomAlert()
    }
  }

  private generateRandomAlert(): void {
    const alertTypes = [
      {
        title: "Grid Connection Instability",
        message: "Intermittent grid connection detected, monitoring for stability",
        severity: "high" as const,
        category: "system" as const,
        source: "Grid Monitor",
      },
      {
        title: "Battery Temperature Warning",
        message: "Battery temperature approaching upper safety limit",
        severity: "medium" as const,
        category: "system" as const,
        source: "Battery Management System",
      },
      {
        title: "Predictive Maintenance Alert",
        message: "AI analysis suggests maintenance needed within 7 days",
        severity: "low" as const,
        category: "maintenance" as const,
        source: "Predictive Analytics",
      },
    ]

    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]

    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      title: alertType.title,
      message: alertType.message,
      severity: alertType.severity,
      category: alertType.category,
      source: alertType.source,
      timestamp: new Date(),
      status: "active",
      escalationLevel: 1,
      affectedSystems: ["System Monitor"],
      recommendedActions: ["Investigate immediately", "Check system logs"],
      metadata: {},
    }

    this.alerts.unshift(newAlert)
    this.notifySubscribers()
  }

  createAlert(alertData: Omit<Alert, "id" | "timestamp" | "status" | "escalationLevel">): Alert {
    const alert: Alert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      timestamp: new Date(),
      status: "active",
      escalationLevel: 1,
    }

    this.alerts.unshift(alert)
    this.notifySubscribers()
    this.processNotifications(alert)

    return alert
  }

  acknowledgeAlert(alertId: string, userId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert && alert.status === "active") {
      alert.status = "acknowledged"
      alert.acknowledgedBy = userId
      alert.acknowledgedAt = new Date()
      this.notifySubscribers()
      return true
    }
    return false
  }

  resolveAlert(alertId: string, userId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert && (alert.status === "active" || alert.status === "acknowledged")) {
      alert.status = "resolved"
      alert.resolvedBy = userId
      alert.resolvedAt = new Date()
      this.notifySubscribers()
      return true
    }
    return false
  }

  dismissAlert(alertId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.status = "dismissed"
      this.notifySubscribers()
      return true
    }
    return false
  }

  getAlerts(filters?: {
    status?: Alert["status"][]
    severity?: Alert["severity"][]
    category?: Alert["category"][]
    limit?: number
  }): Alert[] {
    let filteredAlerts = [...this.alerts]

    if (filters) {
      if (filters.status) {
        filteredAlerts = filteredAlerts.filter((a) => filters.status!.includes(a.status))
      }
      if (filters.severity) {
        filteredAlerts = filteredAlerts.filter((a) => filters.severity!.includes(a.severity))
      }
      if (filters.category) {
        filteredAlerts = filteredAlerts.filter((a) => filters.category!.includes(a.category))
      }
      if (filters.limit) {
        filteredAlerts = filteredAlerts.slice(0, filters.limit)
      }
    }

    return filteredAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  getAlertMetrics(): AlertMetrics {
    const totalAlerts = this.alerts.length
    const activeAlerts = this.alerts.filter((a) => a.status === "active").length
    const criticalAlerts = this.alerts.filter((a) => a.severity === "critical" && a.status === "active").length

    const resolvedAlerts = this.alerts.filter((a) => a.status === "resolved" && a.resolvedAt && a.timestamp)
    const averageResolutionTime =
      resolvedAlerts.length > 0
        ? resolvedAlerts.reduce((sum, alert) => {
          const resolutionTime = alert.resolvedAt!.getTime() - alert.timestamp.getTime()
          return sum + resolutionTime
        }, 0) /
        resolvedAlerts.length /
        (1000 * 60) // Convert to minutes
        : 0

    const alertsByCategory = this.alerts.reduce(
      (acc, alert) => {
        acc[alert.category] = (acc[alert.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const alertsBySeverity = this.alerts.reduce(
      (acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const escalatedAlerts = this.alerts.filter((a) => a.escalationLevel > 1).length
    const escalationRate = totalAlerts > 0 ? (escalatedAlerts / totalAlerts) * 100 : 0

    const acknowledgedAlerts = this.alerts.filter((a) => a.acknowledgedAt).length
    const acknowledgedRate = totalAlerts > 0 ? (acknowledgedAlerts / totalAlerts) * 100 : 0

    return {
      totalAlerts,
      activeAlerts,
      criticalAlerts,
      averageResolutionTime,
      alertsByCategory,
      alertsBySeverity,
      escalationRate,
      acknowledgedRate,
    }
  }

  subscribe(callback: (alerts: Alert[]) => void): () => void {
    this.subscribers.push(callback)
    callback(this.alerts) // Send initial data

    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => callback(this.alerts))
  }

  private processNotifications(alert: Alert): void {
    // In a real implementation, this would send actual notifications
    console.log(`[Alert System] Processing notifications for alert: ${alert.title}`)

    // Find matching rules and send notifications
    const matchingRules = this.alertRules.filter(
      (rule) => rule.enabled && rule.category === alert.category && rule.severity === alert.severity,
    )

    matchingRules.forEach((rule) => {
      rule.escalationRules.forEach((escalation) => {
        if (escalation.level === alert.escalationLevel) {
          escalation.channels.forEach((channel) => {
            this.sendNotification(channel, alert, escalation.recipients)
          })
        }
      })
    })
  }

  private sendNotification(channel: string, alert: Alert, recipients: string[]): void {
    // Mock notification sending
    console.log(`[${channel.toUpperCase()}] Sending alert "${alert.title}" to:`, recipients)
  }

  getAlertRules(): AlertRule[] {
    return [...this.alertRules]
  }

  createAlertRule(rule: Omit<AlertRule, "id" | "createdAt">): AlertRule {
    const newRule: AlertRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date(),
    }

    this.alertRules.push(newRule)
    return newRule
  }

  updateAlertRule(ruleId: string, updates: Partial<AlertRule>): boolean {
    const ruleIndex = this.alertRules.findIndex((r) => r.id === ruleId)
    if (ruleIndex !== -1) {
      this.alertRules[ruleIndex] = { ...this.alertRules[ruleIndex], ...updates }
      return true
    }
    return false
  }

  deleteAlertRule(ruleId: string): boolean {
    const ruleIndex = this.alertRules.findIndex((r) => r.id === ruleId)
    if (ruleIndex !== -1) {
      this.alertRules.splice(ruleIndex, 1)
      return true
    }
    return false
  }
}

export default AlertManagementService
