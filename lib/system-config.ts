import type { User } from "@clerk/nextjs/server"

export interface SystemConfiguration {
  id: string
  category: "general" | "security" | "alerts" | "integrations" | "maintenance" | "compliance"
  key: string
  value: any
  description: string
  dataType: "string" | "number" | "boolean" | "json" | "password"
  isRequired: boolean
  isReadOnly: boolean
  validationRules?: {
    min?: number
    max?: number
    pattern?: string
    options?: string[]
  }
  lastModified: Date
  modifiedBy: string
}

export interface SystemHealth {
  overall: number
  components: {
    database: { status: "healthy" | "warning" | "critical"; score: number; message: string }
    api: { status: "healthy" | "warning" | "critical"; score: number; message: string }
    storage: { status: "healthy" | "warning" | "critical"; score: number; message: string }
    network: { status: "healthy" | "warning" | "critical"; score: number; message: string }
    security: { status: "healthy" | "warning" | "critical"; score: number; message: string }
  }
  uptime: number
  lastCheck: Date
}

export interface MaintenanceTask {
  id: string
  title: string
  description: string
  type: "backup" | "cleanup" | "update" | "diagnostic" | "security"
  status: "pending" | "running" | "completed" | "failed"
  priority: "low" | "medium" | "high" | "critical"
  scheduledAt?: Date
  startedAt?: Date
  completedAt?: Date
  progress: number
  logs: string[]
  createdBy: string
  assignedTo?: string
}

export interface IntegrationConfig {
  id: string
  name: string
  type: "database" | "api" | "notification" | "monitoring" | "backup"
  status: "active" | "inactive" | "error"
  endpoint?: string
  credentials: Record<string, any>
  settings: Record<string, any>
  lastSync?: Date
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
}

class SystemConfigurationService {
  private static instance: SystemConfigurationService
  private configurations: SystemConfiguration[] = []
  private maintenanceTasks: MaintenanceTask[] = []
  private integrations: IntegrationConfig[] = []

  static getInstance(): SystemConfigurationService {
    if (!SystemConfigurationService.instance) {
      SystemConfigurationService.instance = new SystemConfigurationService()
    }
    return SystemConfigurationService.instance
  }

  constructor() {
    this.initializeDefaultConfigurations()
    this.initializeMaintenanceTasks()
    this.initializeIntegrations()
  }

  private initializeDefaultConfigurations(): void {
    this.configurations = [
      // General Settings
      {
        id: "config-1",
        category: "general",
        key: "system.name",
        value: "Government Energy Portal",
        description: "System display name",
        dataType: "string",
        isRequired: true,
        isReadOnly: false,
        lastModified: new Date(),
        modifiedBy: "system",
      },
      {
        id: "config-2",
        category: "general",
        key: "system.timezone",
        value: "UTC",
        description: "System timezone for all operations",
        dataType: "string",
        isRequired: true,
        isReadOnly: false,
        validationRules: {
          options: ["UTC", "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"],
        },
        lastModified: new Date(),
        modifiedBy: "system",
      },
      {
        id: "config-3",
        category: "general",
        key: "data.retention.days",
        value: 2555, // 7 years
        description: "Data retention period in days (government requirement: 7 years)",
        dataType: "number",
        isRequired: true,
        isReadOnly: false,
        validationRules: { min: 365, max: 3650 },
        lastModified: new Date(),
        modifiedBy: "system",
      },

      // Security Settings
      {
        id: "config-4",
        category: "security",
        key: "auth.session.timeout",
        value: 480, // 8 hours
        description: "Session timeout in minutes",
        dataType: "number",
        isRequired: true,
        isReadOnly: false,
        validationRules: { min: 15, max: 1440 },
        lastModified: new Date(),
        modifiedBy: "system",
      },
      {
        id: "config-5",
        category: "security",
        key: "auth.password.complexity",
        value: true,
        description: "Enforce complex password requirements",
        dataType: "boolean",
        isRequired: true,
        isReadOnly: false,
        lastModified: new Date(),
        modifiedBy: "system",
      },
      {
        id: "config-6",
        category: "security",
        key: "security.encryption.level",
        value: "AES-256",
        description: "Data encryption standard",
        dataType: "string",
        isRequired: true,
        isReadOnly: true,
        lastModified: new Date(),
        modifiedBy: "system",
      },

      // Alert Settings
      {
        id: "config-7",
        category: "alerts",
        key: "alerts.max.active",
        value: 1000,
        description: "Maximum number of active alerts before cleanup",
        dataType: "number",
        isRequired: true,
        isReadOnly: false,
        validationRules: { min: 100, max: 10000 },
        lastModified: new Date(),
        modifiedBy: "system",
      },
      {
        id: "config-8",
        category: "alerts",
        key: "alerts.escalation.enabled",
        value: true,
        description: "Enable automatic alert escalation",
        dataType: "boolean",
        isRequired: true,
        isReadOnly: false,
        lastModified: new Date(),
        modifiedBy: "system",
      },

      // Compliance Settings
      {
        id: "config-9",
        category: "compliance",
        key: "audit.logging.enabled",
        value: true,
        description: "Enable comprehensive audit logging",
        dataType: "boolean",
        isRequired: true,
        isReadOnly: true,
        lastModified: new Date(),
        modifiedBy: "system",
      },
      {
        id: "config-10",
        category: "compliance",
        key: "compliance.standard",
        value: "NIST-800-53",
        description: "Government compliance standard",
        dataType: "string",
        isRequired: true,
        isReadOnly: true,
        lastModified: new Date(),
        modifiedBy: "system",
      },
    ]
  }

  private initializeMaintenanceTasks(): void {
    this.maintenanceTasks = [
      {
        id: "task-1",
        title: "Daily System Backup",
        description: "Automated daily backup of all system data and configurations",
        type: "backup",
        status: "completed",
        priority: "high",
        scheduledAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
        progress: 100,
        logs: [
          "Backup initiated at 02:00 UTC",
          "Database backup completed: 2.3 GB",
          "Configuration backup completed: 45 MB",
          "File system backup completed: 1.8 GB",
          "Backup verification successful",
          "Backup completed successfully",
        ],
        createdBy: "system",
        assignedTo: "backup-service",
      },
      {
        id: "task-2",
        title: "Security Scan",
        description: "Weekly security vulnerability scan and assessment",
        type: "security",
        status: "running",
        priority: "high",
        scheduledAt: new Date(),
        startedAt: new Date(Date.now() - 30 * 60 * 1000),
        progress: 65,
        logs: [
          "Security scan initiated",
          "Scanning network interfaces...",
          "Checking authentication systems...",
          "Analyzing access logs...",
          "Currently scanning: API endpoints",
        ],
        createdBy: "admin@energy.gov",
        assignedTo: "security-service",
      },
      {
        id: "task-3",
        title: "Database Optimization",
        description: "Monthly database maintenance and optimization",
        type: "cleanup",
        status: "pending",
        priority: "medium",
        scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        progress: 0,
        logs: [],
        createdBy: "admin@energy.gov",
      },
    ]
  }

  private initializeIntegrations(): void {
    this.integrations = [
      {
        id: "int-1",
        name: "Primary Database",
        type: "database",
        status: "active",
        endpoint: "postgresql://localhost:5432/microgrid",
        credentials: { username: "***", password: "***" },
        settings: {
          maxConnections: 100,
          timeout: 30000,
          ssl: true,
        },
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: "int-2",
        name: "Government SMS Gateway",
        type: "notification",
        status: "active",
        endpoint: "https://sms.gov/api/v1",
        credentials: { apiKey: "***", secret: "***" },
        settings: {
          rateLimit: 100,
          retryAttempts: 3,
          timeout: 10000,
        },
        lastSync: new Date(Date.now() - 2 * 60 * 1000),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: "int-3",
        name: "Backup Storage",
        type: "backup",
        status: "error",
        endpoint: "https://backup.energy.gov/api",
        credentials: { accessKey: "***", secretKey: "***" },
        settings: {
          region: "us-gov-east-1",
          encryption: "AES-256",
          retention: 2555,
        },
        errorMessage: "Connection timeout - check network connectivity",
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ]
  }

  getConfigurations(category?: SystemConfiguration["category"]): SystemConfiguration[] {
    if (category) {
      return this.configurations.filter((config) => config.category === category)
    }
    return [...this.configurations]
  }

  updateConfiguration(id: string, value: any, modifiedBy: string): boolean {
    const config = this.configurations.find((c) => c.id === id)
    if (config && !config.isReadOnly) {
      // Validate the value
      if (this.validateConfigValue(config, value)) {
        config.value = value
        config.lastModified = new Date()
        config.modifiedBy = modifiedBy
        return true
      }
    }
    return false
  }

  private validateConfigValue(config: SystemConfiguration, value: any): boolean {
    if (config.isRequired && (value === null || value === undefined || value === "")) {
      return false
    }

    if (config.validationRules) {
      const rules = config.validationRules

      if (config.dataType === "number") {
        const numValue = Number(value)
        if (isNaN(numValue)) return false
        if (rules.min !== undefined && numValue < rules.min) return false
        if (rules.max !== undefined && numValue > rules.max) return false
      }

      if (config.dataType === "string") {
        if (rules.pattern && !new RegExp(rules.pattern).test(value)) return false
        if (rules.options && !rules.options.includes(value)) return false
      }
    }

    return true
  }

  getSystemHealth(): SystemHealth {
    // Mock system health data
    return {
      overall: 94,
      components: {
        database: { status: "healthy", score: 98, message: "All connections stable" },
        api: { status: "healthy", score: 96, message: "Response times optimal" },
        storage: { status: "warning", score: 85, message: "Disk usage at 78%" },
        network: { status: "healthy", score: 99, message: "All endpoints responsive" },
        security: { status: "healthy", score: 97, message: "No threats detected" },
      },
      uptime: 99.8,
      lastCheck: new Date(),
    }
  }

  getMaintenanceTasks(): MaintenanceTask[] {
    return [...this.maintenanceTasks].sort((a, b) => {
      if (a.status === "running" && b.status !== "running") return -1
      if (b.status === "running" && a.status !== "running") return 1
      return (b.scheduledAt?.getTime() || 0) - (a.scheduledAt?.getTime() || 0)
    })
  }

  createMaintenanceTask(task: Omit<MaintenanceTask, "id" | "progress" | "logs">): MaintenanceTask {
    const newTask: MaintenanceTask = {
      ...task,
      id: `task-${Date.now()}`,
      progress: 0,
      logs: [],
    }

    this.maintenanceTasks.unshift(newTask)
    return newTask
  }

  updateMaintenanceTask(id: string, updates: Partial<MaintenanceTask>): boolean {
    const taskIndex = this.maintenanceTasks.findIndex((t) => t.id === id)
    if (taskIndex !== -1) {
      this.maintenanceTasks[taskIndex] = { ...this.maintenanceTasks[taskIndex], ...updates }
      return true
    }
    return false
  }

  getIntegrations(): IntegrationConfig[] {
    return [...this.integrations]
  }

  testIntegration(id: string): Promise<{ success: boolean; message: string; latency?: number }> {
    return new Promise((resolve) => {
      // Simulate integration test
      setTimeout(() => {
        const integration = this.integrations.find((i) => i.id === id)
        if (!integration) {
          resolve({ success: false, message: "Integration not found" })
          return
        }

        const success = Math.random() > 0.2 // 80% success rate
        resolve({
          success,
          message: success ? "Connection successful" : "Connection failed - timeout",
          latency: success ? Math.floor(Math.random() * 200) + 50 : undefined,
        })
      }, 2000)
    })
  }

  updateIntegration(id: string, updates: Partial<IntegrationConfig>): boolean {
    const integrationIndex = this.integrations.findIndex((i) => i.id === id)
    if (integrationIndex !== -1) {
      this.integrations[integrationIndex] = {
        ...this.integrations[integrationIndex],
        ...updates,
        updatedAt: new Date(),
      }
      return true
    }
    return false
  }

  exportConfiguration(): string {
    const exportData = {
      configurations: this.configurations,
      integrations: this.integrations.map((i) => ({
        ...i,
        credentials: Object.keys(i.credentials).reduce(
          (acc, key) => {
            acc[key] = "***"
            return acc
          },
          {} as Record<string, string>,
        ),
      })),
      exportedAt: new Date(),
      version: "1.0",
    }

    return JSON.stringify(exportData, null, 2)
  }

  getSystemLogs(limit = 100): Array<{
    timestamp: Date
    level: "info" | "warning" | "error"
    category: string
    message: string
    details?: any
  }> {
    // Mock system logs
    const logs = [
      {
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        level: "info" as const,
        category: "Authentication",
        message: "User login successful",
        details: { user: "operator@energy.gov", ip: "192.168.1.100" },
      },
      {
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        level: "warning" as const,
        category: "System",
        message: "High memory usage detected",
        details: { usage: "85%", threshold: "80%" },
      },
      {
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        level: "info" as const,
        category: "Backup",
        message: "Scheduled backup completed successfully",
        details: { size: "4.1 GB", duration: "42 minutes" },
      },
      {
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        level: "error" as const,
        category: "Integration",
        message: "Backup storage connection failed",
        details: { endpoint: "backup.energy.gov", error: "Connection timeout" },
      },
    ]

    return logs.slice(0, limit)
  }
}

export default SystemConfigurationService
