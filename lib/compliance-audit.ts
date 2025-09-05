import type { User } from "@clerk/nextjs/server"

export interface AuditLog {
  id: string
  timestamp: Date
  userId: string
  userName: string
  action: string
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  severity: "low" | "medium" | "high" | "critical"
  category: "authentication" | "configuration" | "data_access" | "system" | "security"
}

export interface ComplianceReport {
  id: string
  generatedAt: Date
  period: { start: Date; end: Date }
  totalEvents: number
  securityEvents: number
  configurationChanges: number
  dataAccessEvents: number
  complianceScore: number
  violations: ComplianceViolation[]
  recommendations: string[]
}

export interface ComplianceViolation {
  id: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
  timestamp: Date
  resolved: boolean
}

class ComplianceAuditService {
  private static instance: ComplianceAuditService
  private auditLogs: AuditLog[] = []
  private complianceRules: Map<string, any> = new Map()

  private constructor() {
    this.initializeComplianceRules()
    this.generateMockAuditLogs()
  }

  static getInstance(): ComplianceAuditService {
    if (!ComplianceAuditService.instance) {
      ComplianceAuditService.instance = new ComplianceAuditService()
    }
    return ComplianceAuditService.instance
  }

  private initializeComplianceRules() {
    this.complianceRules.set("max_failed_logins", 5)
    this.complianceRules.set("session_timeout", 30) // minutes
    this.complianceRules.set("password_complexity", true)
    this.complianceRules.set("data_retention_days", 2555) // 7 years
    this.complianceRules.set("audit_log_retention", 3650) // 10 years
  }

  private generateMockAuditLogs() {
    const actions = [
      "User Login",
      "User Logout",
      "Configuration Change",
      "Data Export",
      "Alert Acknowledged",
      "Report Generated",
      "System Access",
      "Failed Login",
    ]
    const users = ["admin@gov.energy", "operator1@gov.energy", "viewer@gov.energy"]

    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      this.auditLogs.push({
        id: `audit_${i + 1}`,
        timestamp,
        userId: `user_${Math.floor(Math.random() * 3) + 1}`,
        userName: users[Math.floor(Math.random() * users.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        resource: "Microgrid Dashboard",
        details: `Action performed on ${timestamp.toISOString()}`,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: "Mozilla/5.0 (Government Browser)",
        severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
        category: ["authentication", "configuration", "data_access", "system"][Math.floor(Math.random() * 4)] as any,
      })
    }
  }

  logAuditEvent(event: Omit<AuditLog, "id" | "timestamp">): void {
    const auditLog: AuditLog = {
      ...event,
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }
    this.auditLogs.unshift(auditLog)
  }

  getAuditLogs(limit = 100): AuditLog[] {
    return this.auditLogs.slice(0, limit)
  }

  generateComplianceReport(startDate: Date, endDate: Date): ComplianceReport {
    const filteredLogs = this.auditLogs.filter((log) => log.timestamp >= startDate && log.timestamp <= endDate)

    const violations: ComplianceViolation[] = [
      {
        id: "v1",
        type: "Excessive Failed Logins",
        severity: "medium",
        description: "User exceeded maximum failed login attempts",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        resolved: false,
      },
    ]

    return {
      id: `compliance_${Date.now()}`,
      generatedAt: new Date(),
      period: { start: startDate, end: endDate },
      totalEvents: filteredLogs.length,
      securityEvents: filteredLogs.filter((log) => log.category === "security").length,
      configurationChanges: filteredLogs.filter((log) => log.category === "configuration").length,
      dataAccessEvents: filteredLogs.filter((log) => log.category === "data_access").length,
      complianceScore: 94.2,
      violations,
      recommendations: [
        "Implement stronger password policies",
        "Enable two-factor authentication for all admin accounts",
        "Review and update access control policies quarterly",
        "Conduct regular security awareness training",
      ],
    }
  }

  exportAuditLogs(format: "csv" | "json" = "csv"): string {
    if (format === "json") {
      return JSON.stringify(this.auditLogs, null, 2)
    }

    const headers = ["ID", "Timestamp", "User", "Action", "Resource", "IP Address", "Severity"]
    const rows = this.auditLogs.map((log) => [
      log.id,
      log.timestamp.toISOString(),
      log.userName,
      log.action,
      log.resource,
      log.ipAddress,
      log.severity,
    ])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }
}

export default ComplianceAuditService
