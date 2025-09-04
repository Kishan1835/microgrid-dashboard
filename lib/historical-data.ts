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

  static getInstance(): HistoricalDataService {
    if (!HistoricalDataService.instance) {
      HistoricalDataService.instance = new HistoricalDataService()
    }
    return HistoricalDataService.instance
  }

  constructor() {
    this.generateMockHistoricalData()
  }

  private generateMockHistoricalData(): void {
    const now = new Date()
    const data: HistoricalDataPoint[] = []

    // Generate 30 days of hourly data
    for (let days = 30; days >= 0; days--) {
      for (let hour = 0; hour < 24; hour++) {
        const timestamp = new Date(now.getTime() - days * 24 * 60 * 60 * 1000 + hour * 60 * 60 * 1000)

        // Realistic solar generation based on time of day
        const solarMultiplier = hour >= 6 && hour <= 18 ? Math.sin(((hour - 6) / 12) * Math.PI) : 0

        const baseSolar = 1200 * solarMultiplier * (0.8 + Math.random() * 0.4)
        const baseWind = 600 + Math.random() * 800
        const baseConsumption = 1500 + Math.random() * 1000 + (hour >= 18 && hour <= 22 ? 500 : 0)

        data.push({
          timestamp,
          totalGeneration: Math.round(baseSolar + baseWind),
          totalConsumption: Math.round(baseConsumption),
          solarGeneration: Math.round(baseSolar),
          windGeneration: Math.round(baseWind),
          batteryLevel: 60 + Math.random() * 35,
          efficiency: 80 + Math.random() * 15,
          carbonOffset: Math.round(50 + Math.random() * 30),
          systemHealth: 85 + Math.random() * 12,
          gridConnection: Math.random() > 0.95 ? "maintenance" : "connected",
          weatherConditions: {
            temperature: 15 + Math.random() * 20,
            humidity: 40 + Math.random() * 40,
            windSpeed: 5 + Math.random() * 15,
            solarIrradiance: solarMultiplier * (800 + Math.random() * 200),
          },
        })
      }
    }

    this.historicalData = data
  }

  getHistoricalData(
    startDate: Date,
    endDate: Date,
    aggregation: "hourly" | "daily" | "weekly" | "monthly" = "hourly",
  ): HistoricalDataPoint[] {
    const filtered = this.historicalData.filter((d) => d.timestamp >= startDate && d.timestamp <= endDate)

    if (aggregation === "hourly") {
      return filtered
    }

    // Aggregate data based on the specified period
    const aggregated: HistoricalDataPoint[] = []
    const groups = new Map<string, HistoricalDataPoint[]>()

    filtered.forEach((point) => {
      let key: string
      const date = new Date(point.timestamp)

      switch (aggregation) {
        case "daily":
          key = date.toISOString().split("T")[0]
          break
        case "weekly":
          const weekStart = new Date(date)
          weekStart.setDate(date.getDate() - date.getDay())
          key = weekStart.toISOString().split("T")[0]
          break
        case "monthly":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
          break
        default:
          key = point.timestamp.toISOString()
      }

      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(point)
    })

    groups.forEach((points, key) => {
      const avgPoint: HistoricalDataPoint = {
        timestamp: new Date(points[0].timestamp),
        totalGeneration: Math.round(points.reduce((sum, p) => sum + p.totalGeneration, 0) / points.length),
        totalConsumption: Math.round(points.reduce((sum, p) => sum + p.totalConsumption, 0) / points.length),
        solarGeneration: Math.round(points.reduce((sum, p) => sum + p.solarGeneration, 0) / points.length),
        windGeneration: Math.round(points.reduce((sum, p) => sum + p.windGeneration, 0) / points.length),
        batteryLevel: points.reduce((sum, p) => sum + p.batteryLevel, 0) / points.length,
        efficiency: points.reduce((sum, p) => sum + p.efficiency, 0) / points.length,
        carbonOffset: Math.round(points.reduce((sum, p) => sum + p.carbonOffset, 0)),
        systemHealth: points.reduce((sum, p) => sum + p.systemHealth, 0) / points.length,
        gridConnection: points[points.length - 1].gridConnection,
        weatherConditions: {
          temperature: points.reduce((sum, p) => sum + p.weatherConditions.temperature, 0) / points.length,
          humidity: points.reduce((sum, p) => sum + p.weatherConditions.humidity, 0) / points.length,
          windSpeed: points.reduce((sum, p) => sum + p.weatherConditions.windSpeed, 0) / points.length,
          solarIrradiance: points.reduce((sum, p) => sum + p.weatherConditions.solarIrradiance, 0) / points.length,
        },
      }
      aggregated.push(avgPoint)
    })

    return aggregated.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  generatePerformanceReport(startDate: Date, endDate: Date): PerformanceReport {
    const data = this.getHistoricalData(startDate, endDate)

    if (data.length === 0) {
      throw new Error("No data available for the specified time range")
    }

    const totalGeneration = data.reduce((sum, d) => sum + d.totalGeneration, 0)
    const totalConsumption = data.reduce((sum, d) => sum + d.totalConsumption, 0)
    const averageEfficiency = data.reduce((sum, d) => sum + d.efficiency, 0) / data.length
    const carbonOffset = data.reduce((sum, d) => sum + d.carbonOffset, 0)
    const uptime = (data.filter((d) => d.gridConnection === "connected").length / data.length) * 100

    const peakGeneration = data.reduce(
      (max, d) => (d.totalGeneration > max.value ? { value: d.totalGeneration, timestamp: d.timestamp } : max),
      { value: 0, timestamp: new Date() },
    )

    const peakConsumption = data.reduce(
      (max, d) => (d.totalConsumption > max.value ? { value: d.totalConsumption, timestamp: d.timestamp } : max),
      { value: 0, timestamp: new Date() },
    )

    // Calculate trends (simplified)
    const midPoint = Math.floor(data.length / 2)
    const firstHalf = data.slice(0, midPoint)
    const secondHalf = data.slice(midPoint)

    const firstHalfAvgGen = firstHalf.reduce((sum, d) => sum + d.totalGeneration, 0) / firstHalf.length
    const secondHalfAvgGen = secondHalf.reduce((sum, d) => sum + d.totalGeneration, 0) / secondHalf.length
    const generationTrend = ((secondHalfAvgGen - firstHalfAvgGen) / firstHalfAvgGen) * 100

    const firstHalfAvgCons = firstHalf.reduce((sum, d) => sum + d.totalConsumption, 0) / firstHalf.length
    const secondHalfAvgCons = secondHalf.reduce((sum, d) => sum + d.totalConsumption, 0) / secondHalf.length
    const consumptionTrend = ((secondHalfAvgCons - firstHalfAvgCons) / firstHalfAvgCons) * 100

    const firstHalfAvgEff = firstHalf.reduce((sum, d) => sum + d.efficiency, 0) / firstHalf.length
    const secondHalfAvgEff = secondHalf.reduce((sum, d) => sum + d.efficiency, 0) / secondHalf.length
    const efficiencyTrend = ((secondHalfAvgEff - firstHalfAvgEff) / firstHalfAvgEff) * 100

    const recommendations: string[] = []
    if (averageEfficiency < 85) {
      recommendations.push("Consider maintenance on solar panels to improve efficiency")
    }
    if (uptime < 95) {
      recommendations.push("Investigate grid connection stability issues")
    }
    if (generationTrend < -5) {
      recommendations.push("Generation declining - check equipment performance")
    }

    return {
      id: `report-${Date.now()}`,
      generatedAt: new Date(),
      timeRange: { start: startDate, end: endDate },
      summary: {
        totalGeneration,
        totalConsumption,
        averageEfficiency,
        carbonOffset,
        uptime,
        peakGeneration,
        peakConsumption,
      },
      trends: {
        generationTrend,
        consumptionTrend,
        efficiencyTrend,
      },
      compliance: {
        governmentStandards: averageEfficiency >= 85 && uptime >= 95,
        industryBenchmarks: averageEfficiency >= 80,
        environmentalTargets: carbonOffset >= totalGeneration * 0.5,
      },
      recommendations,
    }
  }

  exportData(data: HistoricalDataPoint[], format: "csv" | "json" | "excel"): string | Blob {
    switch (format) {
      case "csv":
        return this.exportToCSV(data)
      case "json":
        return JSON.stringify(data, null, 2)
      case "excel":
        // In a real implementation, you'd use a library like xlsx
        return this.exportToCSV(data) // Fallback to CSV for demo
      default:
        throw new Error("Unsupported export format")
    }
  }

  private exportToCSV(data: HistoricalDataPoint[]): string {
    const headers = [
      "Timestamp",
      "Total Generation (kW)",
      "Total Consumption (kW)",
      "Solar Generation (kW)",
      "Wind Generation (kW)",
      "Battery Level (%)",
      "Efficiency (%)",
      "Carbon Offset (kg)",
      "System Health (%)",
      "Grid Connection",
      "Temperature (°C)",
      "Humidity (%)",
      "Wind Speed (m/s)",
      "Solar Irradiance (W/m²)",
    ]

    const rows = data.map((d) => [
      d.timestamp.toISOString(),
      d.totalGeneration,
      d.totalConsumption,
      d.solarGeneration,
      d.windGeneration,
      d.batteryLevel.toFixed(1),
      d.efficiency.toFixed(1),
      d.carbonOffset,
      d.systemHealth.toFixed(1),
      d.gridConnection,
      d.weatherConditions.temperature.toFixed(1),
      d.weatherConditions.humidity.toFixed(1),
      d.weatherConditions.windSpeed.toFixed(1),
      d.weatherConditions.solarIrradiance.toFixed(1),
    ])

    return [headers, ...rows].map((row) => row.join(",")).join("\n")
  }
}

export default HistoricalDataService
