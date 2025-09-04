"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Zap, Target, Award, AlertCircle, CheckCircle } from "lucide-react"
import type { AdvancedAnalytics } from "@/lib/real-time-data"

interface AdvancedMetricsProps {
  analytics: AdvancedAnalytics
  efficiency: number
}

export function AdvancedMetrics({ analytics, efficiency }: AdvancedMetricsProps) {
  const {
    performanceMetrics = {
      solarEfficiency: 0,
      windEfficiency: 0,
      batteryEfficiency: 0,
      gridStability: 0,
      maintenanceScore: 0,
      overallHealth: 0,
    },
    benchmarks = {
      actualEfficiency: 0,
      targetEfficiency: 85,
      industryAverage: 82,
      governmentStandard: 80,
    },
    predictiveData = {
      nextHourGeneration: 0,
      nextDayPeak: 0,
      maintenanceNeeded: [],
      weatherImpact: 0,
    },
  } = analytics || {}

  const getPerformanceColor = (value: number, threshold = 85) => {
    if (value >= threshold + 5) return "text-primary"
    if (value >= threshold) return "text-secondary"
    return "text-destructive"
  }

  const getPerformanceIcon = (value: number, threshold = 85) => {
    if (value >= threshold) return <CheckCircle className="h-4 w-4 text-primary" />
    return <AlertCircle className="h-4 w-4 text-destructive" />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* System Performance Overview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            System Performance Metrics
          </CardTitle>
          <CardDescription>Real-time performance indicators across all systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Solar Efficiency</span>
                {getPerformanceIcon(performanceMetrics.solarEfficiency)}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={performanceMetrics.solarEfficiency} className="flex-1" />
                <span className={`text-sm font-bold ${getPerformanceColor(performanceMetrics.solarEfficiency)}`}>
                  {performanceMetrics.solarEfficiency}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wind Efficiency</span>
                {getPerformanceIcon(performanceMetrics.windEfficiency)}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={performanceMetrics.windEfficiency} className="flex-1" />
                <span className={`text-sm font-bold ${getPerformanceColor(performanceMetrics.windEfficiency)}`}>
                  {performanceMetrics.windEfficiency}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Battery Health</span>
                {getPerformanceIcon(performanceMetrics.batteryEfficiency, 90)}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={performanceMetrics.batteryEfficiency} className="flex-1" />
                <span className={`text-sm font-bold ${getPerformanceColor(performanceMetrics.batteryEfficiency, 90)}`}>
                  {performanceMetrics.batteryEfficiency}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Grid Stability</span>
                {getPerformanceIcon(performanceMetrics.gridStability, 95)}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={performanceMetrics.gridStability} className="flex-1" />
                <span className={`text-sm font-bold ${getPerformanceColor(performanceMetrics.gridStability, 95)}`}>
                  {performanceMetrics.gridStability}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Maintenance Score</span>
                {getPerformanceIcon(performanceMetrics.maintenanceScore)}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={performanceMetrics.maintenanceScore} className="flex-1" />
                <span className={`text-sm font-bold ${getPerformanceColor(performanceMetrics.maintenanceScore)}`}>
                  {performanceMetrics.maintenanceScore}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Health</span>
                {getPerformanceIcon(performanceMetrics.overallHealth)}
              </div>
              <div className="flex items-center gap-2">
                <Progress value={performanceMetrics.overallHealth} className="flex-1" />
                <span className={`text-sm font-bold ${getPerformanceColor(performanceMetrics.overallHealth)}`}>
                  {performanceMetrics.overallHealth}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Predictive Analytics
          </CardTitle>
          <CardDescription>AI-powered forecasting and insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Next Hour Generation</span>
            </div>
            <div className="text-lg font-bold text-primary">
              {predictiveData.nextHourGeneration.toLocaleString()} kW
            </div>
            <div className="text-xs text-muted-foreground">+8% from current output</div>
          </div>

          <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">Peak Demand Forecast</span>
            </div>
            <div className="text-lg font-bold text-secondary">{predictiveData.nextDayPeak.toLocaleString()} kW</div>
            <div className="text-xs text-muted-foreground">Tomorrow 2:00 PM - 4:00 PM</div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Maintenance Alerts</span>
            {predictiveData.maintenanceNeeded.map((item, index) => (
              <Badge key={index} variant="outline" className="mr-2 mb-1">
                {item}
              </Badge>
            ))}
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Weather Impact</span>
            </div>
            <div className="text-lg font-bold">
              {predictiveData.weatherImpact > 0 ? "+" : ""}
              {predictiveData.weatherImpact}%
            </div>
            <div className="text-xs text-muted-foreground">Expected generation variance</div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Benchmarks */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Performance Benchmarks
          </CardTitle>
          <CardDescription>Comparison against industry standards and government targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-2xl font-bold text-primary mb-1">{benchmarks.actualEfficiency.toFixed(1)}%</div>
              <div className="text-sm font-medium mb-2">Current Efficiency</div>
              <div className="flex items-center justify-center gap-1">
                {benchmarks.actualEfficiency > benchmarks.targetEfficiency ? (
                  <TrendingUp className="h-3 w-3 text-primary" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className="text-xs text-muted-foreground">vs {benchmarks.targetEfficiency}% target</span>
              </div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold mb-1">{benchmarks.targetEfficiency}%</div>
              <div className="text-sm font-medium mb-2">Target Efficiency</div>
              <div className="text-xs text-muted-foreground">Government mandate</div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold mb-1">{benchmarks.industryAverage}%</div>
              <div className="text-sm font-medium mb-2">Industry Average</div>
              <div className="text-xs text-muted-foreground">Renewable sector</div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold mb-1">{benchmarks.governmentStandard}%</div>
              <div className="text-sm font-medium mb-2">Gov Standard</div>
              <div className="text-xs text-muted-foreground">Minimum requirement</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
