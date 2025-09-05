export interface RealTimeMetrics {
  timestamp: Date
  totalGeneration: number
  totalConsumption: number
  surplus: number
  batteryLevel: number
  batteryStatus: "charging" | "discharging" | "idle"
  solarGeneration: number
  windGeneration: number
  gridConnection: "connected" | "disconnected" | "maintenance"
  efficiency: number
  carbonOffset: number
  systemHealth: number
  predictedGeneration: number
  peakDemandForecast: number
}

export interface SystemPerformance {
  solarEfficiency: number
  windEfficiency: number
  batteryEfficiency: number
  gridStability: number
  maintenanceScore: number
  overallHealth: number
}

export interface AdvancedAnalytics {
  energyTrends: {
    daily: number[]
    weekly: number[]
    monthly: number[]
  }
  performanceMetrics: SystemPerformance
  predictiveData: {
    nextHourGeneration: number
    nextDayPeak: number
    maintenanceNeeded: string[]
    weatherImpact: number
  }
  benchmarks: {
    targetEfficiency: number
    actualEfficiency: number
    industryAverage: number
    governmentStandard: number
  }
}

class RealTimeDataService {
  private static instance: RealTimeDataService
  private subscribers: ((data: RealTimeMetrics) => void)[] = []
  private intervalId: NodeJS.Timeout | null = null
  private currentData: RealTimeMetrics
  private userRole: string = "viewer"

  constructor() {
    this.currentData = this.generateInitialData()
    // Removed setInterval from constructor to avoid multiple intervals
  }

  static getInstance(userRole?: string): RealTimeDataService {
    if (!RealTimeDataService.instance) {
      RealTimeDataService.instance = new RealTimeDataService()
    }
    if (userRole) {
      RealTimeDataService.instance.userRole = userRole
    }
    return RealTimeDataService.instance
  }

  private generateInitialData(): RealTimeMetrics {
    const baseTotalGeneration = this.userRole === "admin" ? 3000 : 2500;
    const solarShare = this.userRole === "admin" ? 0.6 : 0.5;
    const windShare = this.userRole === "admin" ? 0.4 : 0.5;

    return {
      timestamp: new Date(),
      totalGeneration: baseTotalGeneration,
      totalConsumption: this.userRole === "admin" ? 2200 : 2000,
      surplus: this.userRole === "admin" ? 800 : 500,
      batteryLevel: 65 + Math.random() * 30,
      batteryStatus: "charging",
      solarGeneration: Math.round(solarShare * baseTotalGeneration + Math.random() * 100),
      windGeneration: Math.round(windShare * baseTotalGeneration + Math.random() * 80),
      gridConnection: "connected",
      efficiency: 85 + Math.random() * 10,
      carbonOffset: Math.round(1200 + Math.random() * 300),
      systemHealth: this.userRole === "admin" ? 95 : 90,
      predictedGeneration: this.userRole === "admin" ? 3200 : 2800,
      peakDemandForecast: this.userRole === "admin" ? 2900 : 2500,
    }
  }

  private updateData(): RealTimeMetrics {
    const now = new Date()
    const timeFactor = now.getMinutes() / 60 + now.getHours() / 24

    const baseGenerationValue = (this.userRole === "admin" ? 2800 : 2300) + Math.sin(timeFactor * Math.PI * 2) * 500
    const baseConsumptionValue = (this.userRole === "admin" ? 2000 : 1800) + Math.cos(timeFactor * Math.PI * 2) * 300

    const solarShare = this.userRole === "admin" ? 0.6 : 0.5;
    const windShare = this.userRole === "admin" ? 0.4 : 0.5;

    const solar = Math.max(0, solarShare * baseGenerationValue + Math.random() * 100)
    const wind = Math.max(0, windShare * baseGenerationValue + Math.random() * 80)
    const totalGeneration = solar + wind
    const totalConsumption = Math.max(0, baseConsumptionValue + Math.random() * 50)

    const surplus = totalGeneration - totalConsumption

    let batteryLevel = this.currentData.batteryLevel + surplus / 100 - (Math.random() - 0.5) * 5
    batteryLevel = Math.max(0, Math.min(100, batteryLevel))

    let batteryStatus: "charging" | "discharging" | "idle" = "idle"
    if (surplus > 50) {
      batteryStatus = "charging"
    } else if (surplus < -50) {
      batteryStatus = "discharging"
    }

    this.currentData = {
      timestamp: now,
      totalGeneration: Math.round(totalGeneration),
      totalConsumption: Math.round(totalConsumption),
      surplus: Math.round(surplus),
      batteryLevel: Math.max(10, Math.min(95, batteryLevel)),
      batteryStatus: batteryStatus,
      solarGeneration: Math.round(solar),
      windGeneration: Math.round(wind),
      gridConnection: Math.random() > 0.98 ? "maintenance" : "connected",
      efficiency: Math.max(75, Math.min(98, this.currentData.efficiency + (Math.random() - 0.5) * 2)),
      carbonOffset: Math.round(this.currentData.carbonOffset + Math.random() * 10),
      systemHealth: Math.max(80, Math.min(100, this.currentData.systemHealth + (Math.random() - 0.5) * 1)),
      predictedGeneration: Math.round(totalGeneration + 100 + Math.random() * 200),
      peakDemandForecast: Math.round(2400 + Math.random() * 400),
    }

    return this.currentData
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((sub) => sub(this.currentData))
  }

  subscribe(callback: (data: RealTimeMetrics) => void): () => void {
    this.subscribers.push(callback)

    // Send initial data
    callback(this.currentData)

    // Start interval only if it's not already running
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        const newData = this.updateData()
        this.subscribers.forEach((sub) => sub(newData))
      }, 3000) // Update every 3 seconds
    }

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }

      // Stop interval if no more subscribers
      if (this.subscribers.length === 0 && this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    }
  }

  getCurrentData(): RealTimeMetrics {
    return this.currentData
  }

  getAdvancedAnalytics(): AdvancedAnalytics {
    return {
      energyTrends: {
        daily: Array.from(
          { length: 24 },
          (_, i) => 1500 + Math.sin((i / 24) * 2 * Math.PI) * 800 + Math.random() * 200,
        ),
        weekly: Array.from({ length: 7 }, () => 35000 + Math.random() * 10000),
        monthly: Array.from({ length: 12 }, () => 150000 + Math.random() * 50000),
      },
      performanceMetrics: {
        solarEfficiency: 92.5,
        windEfficiency: 87.3,
        batteryEfficiency: 94.1,
        gridStability: 98.7,
        maintenanceScore: 89.2,
        overallHealth: 91.8,
      },
      predictiveData: {
        nextHourGeneration: this.currentData.predictedGeneration,
        nextDayPeak: this.currentData.peakDemandForecast,
        maintenanceNeeded: ["Wind Turbine 2", "Solar Panel Array C"],
        weatherImpact: 15.2,
      },
      benchmarks: {
        targetEfficiency: 90,
        actualEfficiency: this.currentData.efficiency,
        industryAverage: 85,
        governmentStandard: 88,
      },
    }
  }
}

export default RealTimeDataService
