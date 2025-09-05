export interface HistoricalDataPoint {
  timestamp: Date
  totalGeneration: number
  totalConsumption: number
  solarGeneration: number
  windGeneration: number
  batteryLevel: number
  efficiency: number
  carbonOffset: number
  systemHealth: number
  gridConnection: "connected" | "disconnected" | "maintenance"
  weatherConditions: {
    temperature: number
    humidity: number
    windSpeed: number
    solarIrradiance: number
  }
}

export interface ReportConfig {
  id: string
  name: string
  description: string
  type: "performance" | "compliance" | "environmental" | "maintenance" | "custom"
  timeRange: {
    start: Date
    end: Date
  }
  metrics: string[]
  format: "pdf" | "csv" | "excel" | "json"
  schedule?: {
    frequency: "daily" | "weekly" | "monthly" | "quarterly"
    recipients: string[]
  }
}

export interface PerformanceReport {
  id: string
  generatedAt: Date
  timeRange: { start: Date; end: Date }
  summary: {
    totalGeneration: number
    totalConsumption: number
    averageEfficiency: number
    carbonOffset: number
    uptime: number
    peakGeneration: { value: number; timestamp: Date }
    peakConsumption: { value: number; timestamp: Date }
  }
  trends: {
    generationTrend: number // percentage change
    consumptionTrend: number
    efficiencyTrend: number
  }
  compliance: {
    governmentStandards: boolean
    industryBenchmarks: boolean
    environmentalTargets: boolean
  }
  recommendations: string[]
}

class HistoricalDataService {
  private static instance: HistoricalDataService
  private historicalData: HistoricalDataPoint[] = []
  private userRole: string = "viewer"

  static getInstance(userRole?: string): HistoricalDataService {
    if (!HistoricalDataService.instance) {
      HistoricalDataService.instance = new HistoricalDataService()
    }
    if (userRole) {
      HistoricalDataService.instance.userRole = userRole
    }
    return HistoricalDataService.instance
  }

  constructor() {
    this.generateMockHistoricalData()
  }

  private generateMockHistoricalData(): void {
    const data: HistoricalDataPoint[] = []
    const now = new Date()
    const days = 90 // Generate 90 days of historical data

    for (let i = days; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000) // Daily data points

      const baseGeneration = this.userRole === "admin" ? 25000 : 18000 + Math.random() * 5000
      const baseConsumption = this.userRole === "admin" ? 20000 : 15000 + Math.random() * 4000

      data.push({
        timestamp,
        totalGeneration: baseGeneration + Math.sin(i / 10) * 3000,
        totalConsumption: baseConsumption + Math.cos(i / 15) * 2000,
        solarGeneration: (baseGeneration * 0.6) + Math.random() * 1000,
        windGeneration: (baseGeneration * 0.4) + Math.random() * 800,
        batteryLevel: 50 + Math.sin(i / 5) * 40,
        efficiency: 80 + Math.random() * 15,
        carbonOffset: 10000 + Math.random() * 5000,
        systemHealth: 90 + Math.random() * 10,
        gridConnection: Math.random() > 0.95 ? "maintenance" : "connected",
        weatherConditions: {
          temperature: 15 + Math.sin(i / 7) * 10,
          humidity: 60 + Math.cos(i / 8) * 20,
          windSpeed: 5 + Math.random() * 10,
          solarIrradiance: 300 + Math.sin(i / 9) * 200,
        },
      })
    }
    this.historicalData = data
  }

  getHistoricalData(
    startDate: Date,
    endDate: Date,
    aggregation: "hourly" | "daily" | "weekly" | "monthly" = "hourly",
  ): HistoricalDataPoint[] {
    let filteredData = this.historicalData.filter(
      (data) => data.timestamp >= startDate && data.timestamp <= endDate,
    )

    if (this.userRole !== "admin") {
      // For non-admin, reduce data detail or scope
      filteredData = filteredData.map(data => ({
        ...data,
        totalGeneration: data.totalGeneration * 0.8, // Simulate less access
        totalConsumption: data.totalConsumption * 0.9,
        carbonOffset: data.carbonOffset * 0.7
      }));
    }

    // Simplified aggregation logic for demonstration
    // In a real app, this would involve complex data processing
    if (aggregation === "daily") {
      // Return daily aggregated data
    }

    return filteredData
  }

  generatePerformanceReport(startDate: Date, endDate: Date): PerformanceReport {
    const relevantData = this.getHistoricalData(startDate, endDate, "daily")

    const totalGeneration = relevantData.reduce((sum, d) => sum + d.totalGeneration, 0)
    const totalConsumption = relevantData.reduce((sum, d) => sum + d.totalConsumption, 0)
    const averageEfficiency =
      relevantData.reduce((sum, d) => sum + d.efficiency, 0) / relevantData.length || 0
    const carbonOffset = relevantData.reduce((sum, d) => sum + d.carbonOffset, 0)

    const complianceScore = this.userRole === "admin" ? 95 : 85;
    const recommendations = this.userRole === "admin" ?
      ["Review Q3 performance for anomalies", "Optimize battery storage algorithms"] :
      ["Monitor daily consumption trends", "Consider energy-saving initiatives"];

    return {
      id: `report-${Date.now()}`,
      generatedAt: new Date(),
      timeRange: { start: startDate, end: endDate },
      summary: {
        totalGeneration,
        totalConsumption,
        averageEfficiency,
        carbonOffset,
        uptime: 99.9,
        peakGeneration: {
          value: Math.max(...relevantData.map((d) => d.totalGeneration)),
          timestamp: relevantData.find(
            (d) => d.totalGeneration === Math.max(...relevantData.map((d) => d.totalGeneration)),
          )?.timestamp || new Date(),
        },
        peakConsumption: {
          value: Math.max(...relevantData.map((d) => d.totalConsumption)),
          timestamp: relevantData.find(
            (d) => d.totalConsumption === Math.max(...relevantData.map((d) => d.totalConsumption)),
          )?.timestamp || new Date(),
        },
      },
      trends: {
        generationTrend: Math.random() * 10 - 5, // -5% to +5%
        consumptionTrend: Math.random() * 10 - 5,
        efficiencyTrend: Math.random() * 5 - 2.5,
      },
      compliance: {
        governmentStandards: complianceScore >= 90,
        industryBenchmarks: complianceScore >= 80,
        environmentalTargets: complianceScore >= 85,
      },
      recommendations,
    }
  }

  exportData(data: HistoricalDataPoint[], format: "csv" | "json" | "excel"): string | Blob {
    if (this.userRole !== "admin" && format === "excel") {
      throw new Error("Only administrators can export to Excel.");
    }

    switch (format) {
      case "csv":
        return this.exportToCSV(data)
      case "json":
        return JSON.stringify(data, null, 2)
      case "excel":
        // In a real app, you'd use a library like 'xlsx' to generate an Excel file
        return new Blob(["Excel data simulation for admin"], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      default:
        return JSON.stringify(data, null, 2)
    }
  }

  private exportToCSV(data: HistoricalDataPoint[]): string {
    const header = Object.keys(data[0]).join(",")
    const rows = data.map((row) => Object.values(row).join(","))
    return [header, ...rows].join("\n")
  }
}

export default HistoricalDataService
