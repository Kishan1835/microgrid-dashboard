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

  constructor() {
    this.currentData = this.generateInitialData()
  }

  static getInstance(): RealTimeDataService {
    if (!RealTimeDataService.instance) {
      RealTimeDataService.instance = new RealTimeDataService()
    }
    return RealTimeDataService.instance
  }

  private generateInitialData(): RealTimeMetrics {
    const now = new Date()
    const hour = now.getHours()

    // Simulate realistic solar generation based on time of day
    const solarMultiplier = hour >= 6 && hour <= 18 ? Math.sin(((hour - 6) / 12) * Math.PI) : 0

    const baseWind = 800 + Math.random() * 600
    const baseSolar = 1200 * solarMultiplier + Math.random() * 200

    return {
      timestamp: now,
      totalGeneration: Math.round(baseSolar + baseWind),
      totalConsumption: Math.round(1800 + Math.random() * 800),
      surplus: 0, // Will be calculated
      batteryLevel: 65 + Math.random() * 30,
      batteryStatus: "charging",
      solarGeneration: Math.round(baseSolar),
      windGeneration: Math.round(baseWind),
      gridConnection: "connected",
      efficiency: 85 + Math.random() * 10,
      carbonOffset: Math.round(1200 + Math.random() * 300),
      systemHealth: 90 + Math.random() * 8,
      predictedGeneration: Math.round(baseSolar + baseWind + 200),
      peakDemandForecast: Math.round(2400 + Math.random() * 400),
    }
  }

  private updateData(): RealTimeMetrics {
    const previous = this.currentData
    const now = new Date()
    const hour = now.getHours()

    // Realistic solar generation curve
    const solarMultiplier = hour >= 6 && hour <= 18 ? Math.sin(((hour - 6) / 12) * Math.PI) : 0

    // Add some randomness but keep it realistic
    const windVariation = (Math.random() - 0.5) * 100
    const solarVariation = (Math.random() - 0.5) * 150 * solarMultiplier
    const consumptionVariation = (Math.random() - 0.5) * 200

    const newSolar = Math.max(0, previous.solarGeneration + solarVariation)
    const newWind = Math.max(200, previous.windGeneration + windVariation)
    const newConsumption = Math.max(1000, previous.totalConsumption + consumptionVariation)
    const totalGen = newSolar + newWind

    this.currentData = {
      timestamp: now,
      totalGeneration: Math.round(totalGen),
      totalConsumption: Math.round(newConsumption),
      surplus: Math.round(totalGen - newConsumption),
      batteryLevel: Math.max(10, Math.min(95, previous.batteryLevel + (Math.random() - 0.5) * 3)),
      batteryStatus: totalGen > newConsumption ? "charging" : "discharging",
      solarGeneration: Math.round(newSolar),
      windGeneration: Math.round(newWind),
      gridConnection: Math.random() > 0.98 ? "maintenance" : "connected",
      efficiency: Math.max(75, Math.min(98, previous.efficiency + (Math.random() - 0.5) * 2)),
      carbonOffset: Math.round(previous.carbonOffset + Math.random() * 10),
      systemHealth: Math.max(80, Math.min(100, previous.systemHealth + (Math.random() - 0.5) * 1)),
      predictedGeneration: Math.round(totalGen + 100 + Math.random() * 200),
      peakDemandForecast: Math.round(2400 + Math.random() * 400),
    }

    return this.currentData
  }

  subscribe(callback: (data: RealTimeMetrics) => void): () => void {
    this.subscribers.push(callback)

    // Send initial data
    callback(this.currentData)

    // Start interval if this is the first subscriber
    if (this.subscribers.length === 1) {
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
