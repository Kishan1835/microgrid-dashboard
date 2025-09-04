"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { RealTimeMetrics } from "@/lib/real-time-data"
import {
  TrendingUp,
  Activity,
  BarChart3,
  PieChartIcon,
  Gauge,
  Clock,
  Target,
  Zap,
  Battery,
  Sun,
  Wind,
  Leaf,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface EnhancedRealTimeChartsProps {
  currentData: RealTimeMetrics
}

export function EnhancedRealTimeCharts({ currentData }: EnhancedRealTimeChartsProps) {
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line")
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h">("6h")

  useEffect(() => {
    // Generate enhanced historical data for detailed visualization
    const generateDetailedData = () => {
      const data = []
      const now = new Date()
      const intervals = timeRange === "1h" ? 60 : timeRange === "6h" ? 72 : 144
      const stepMinutes = timeRange === "1h" ? 1 : timeRange === "6h" ? 5 : 10

      for (let i = intervals; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * stepMinutes * 60 * 1000)
        const baseGeneration = 2500 + Math.sin(i * 0.1) * 500
        const baseConsumption = 2000 + Math.sin(i * 0.15) * 300

        data.push({
          time: timestamp.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            ...(timeRange === "24h" && { hour12: false }),
          }),
          timestamp,
          totalGeneration: Math.max(0, baseGeneration + (Math.random() - 0.5) * 200),
          totalConsumption: Math.max(0, baseConsumption + (Math.random() - 0.5) * 150),
          solarGeneration: Math.max(0, baseGeneration * 0.6 + (Math.random() - 0.5) * 100),
          windGeneration: Math.max(0, baseGeneration * 0.4 + (Math.random() - 0.5) * 100),
          batteryLevel: Math.max(20, Math.min(100, 75 + Math.sin(i * 0.05) * 15)),
          efficiency: Math.max(80, Math.min(95, 88 + Math.sin(i * 0.08) * 5)),
          gridLoad: Math.max(0, baseConsumption * 0.8 + (Math.random() - 0.5) * 100),
          carbonOffset: Math.max(0, 1000 + Math.sin(i * 0.12) * 200),
          powerQuality: Math.max(95, Math.min(100, 98 + (Math.random() - 0.5) * 2)),
          gridStability: Math.max(90, Math.min(100, 96 + (Math.random() - 0.5) * 3)),
          loadForecast: Math.max(0, baseConsumption * 1.1 + Math.sin(i * 0.2) * 200),
          weatherImpact: Math.max(0, Math.min(100, 75 + Math.sin(i * 0.3) * 25)),
          systemReliability: Math.max(95, Math.min(100, 98.5 + (Math.random() - 0.5) * 1.5)),
        })
      }
      return data
    }

    setHistoricalData(generateDetailedData())
  }, [timeRange])

  const efficiencyData = [
    { name: "Current", value: currentData.efficiency, fill: "#10b981" },
    { name: "Remaining", value: 100 - currentData.efficiency, fill: "#e5e7eb" },
  ]

  const systemPerformanceData = [
    { metric: "Generation", current: currentData.totalGeneration, target: 3000, efficiency: 94.9, status: "optimal" },
    {
      metric: "Storage",
      current: currentData.batteryLevel,
      target: 100,
      efficiency: currentData.batteryLevel,
      status: currentData.batteryLevel > 70 ? "optimal" : "warning",
    },
    { metric: "Grid Sync", current: 98.5, target: 100, efficiency: 98.5, status: "optimal" },
    { metric: "Uptime", current: 99.8, target: 99.9, efficiency: 99.8, status: "optimal" },
    { metric: "Power Quality", current: 98.2, target: 100, efficiency: 98.2, status: "optimal" },
    { metric: "Load Balance", current: 96.7, target: 100, efficiency: 96.7, status: "good" },
  ]

  const energyFlowMetrics = [
    {
      source: "Solar Arrays",
      generation: currentData.solarGeneration,
      capacity: 2000,
      efficiency: 92.3,
      status: "active",
      trend: "up",
    },
    {
      source: "Wind Turbines",
      generation: currentData.windGeneration,
      capacity: 1500,
      efficiency: 87.8,
      status: "active",
      trend: "stable",
    },
    {
      source: "Battery Storage",
      generation: currentData.batteryLevel > 50 ? 200 : -150,
      capacity: 1000,
      efficiency: 94.1,
      status: currentData.batteryStatus,
      trend: currentData.batteryStatus === "charging" ? "up" : "down",
    },
  ]

  const renderChart = () => {
    const ChartComponent = chartType === "line" ? LineChart : chartType === "area" ? AreaChart : BarChart

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={historicalData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
          <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#64748b" }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #10b981",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend />

          {chartType === "line" && (
            <>
              <Line
                type="monotone"
                dataKey="totalGeneration"
                stroke="#10b981"
                strokeWidth={3}
                name="Total Generation (kW)"
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="totalConsumption"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Total Consumption (kW)"
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="solarGeneration"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Solar (kW)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="windGeneration"
                stroke="#06b6d4"
                strokeWidth={2}
                name="Wind (kW)"
                dot={false}
              />
            </>
          )}

          {chartType === "area" && (
            <>
              <Area
                type="monotone"
                dataKey="totalGeneration"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.7}
                name="Total Generation (kW)"
              />
              <Area
                type="monotone"
                dataKey="totalConsumption"
                stackId="2"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.7}
                name="Total Consumption (kW)"
              />
            </>
          )}

          {chartType === "bar" && (
            <>
              <Bar dataKey="solarGeneration" fill="#f59e0b" name="Solar (kW)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="windGeneration" fill="#06b6d4" name="Wind (kW)" radius={[2, 2, 0, 0]} />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-6 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
            Enhanced Real-Time Analytics
          </h3>
          <p className="text-slate-600">
            Government-grade data visualization with comprehensive monitoring capabilities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
            <Activity className="h-3 w-3 mr-1 animate-pulse" />
            Live Data Stream
          </Badge>
          <Badge variant="outline" className="bg-teal-100 text-teal-700 border-teal-300">
            Update Rate: 3s
          </Badge>
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">
            Classification: OFFICIAL
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {energyFlowMetrics.map((metric, index) => (
          <Card key={index} className="border-emerald-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-700">{metric.source}</CardTitle>
                <div className="flex items-center gap-1">
                  {metric.source.includes("Solar") && <Sun className="h-4 w-4 text-yellow-600" />}
                  {metric.source.includes("Wind") && <Wind className="h-4 w-4 text-sky-600" />}
                  {metric.source.includes("Battery") && <Battery className="h-4 w-4 text-amber-600" />}
                  {metric.trend === "up" && <ArrowUpRight className="h-3 w-3 text-emerald-600" />}
                  {metric.trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-600" />}
                  {metric.trend === "stable" && <Activity className="h-3 w-3 text-slate-600" />}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-700">
                    {Math.abs(metric.generation).toLocaleString()} kW
                  </span>
                  <Badge
                    variant={
                      metric.status === "active" ? "default" : metric.status === "charging" ? "secondary" : "outline"
                    }
                    className={
                      metric.status === "active"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                        : metric.status === "charging"
                          ? "bg-amber-100 text-amber-700 border-amber-300"
                          : "bg-slate-100 text-slate-700 border-slate-300"
                    }
                  >
                    {metric.status}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600">
                  Efficiency: {metric.efficiency}% | Capacity:{" "}
                  {((Math.abs(metric.generation) / metric.capacity) * 100).toFixed(1)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="power-flow" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm border border-emerald-200">
          <TabsTrigger
            value="power-flow"
            className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            Power Flow
          </TabsTrigger>
          <TabsTrigger
            value="efficiency"
            className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            Efficiency
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="environmental"
            className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            Environmental
          </TabsTrigger>
          <TabsTrigger
            value="grid-analysis"
            className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            Grid Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="power-flow" className="space-y-6">
          <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <BarChart3 className="h-5 w-5" />
                Power Generation & Consumption Analysis
              </CardTitle>
              <CardDescription>Real-time power flow with predictive analytics and historical trends</CardDescription>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-slate-700">Chart Type:</span>
                  {(["line", "area", "bar"] as const).map((type) => (
                    <Button
                      key={type}
                      variant={chartType === type ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType(type)}
                      className={chartType === type ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                      {type === "line" && <Activity className="h-3 w-3" />}
                      {type === "area" && <TrendingUp className="h-3 w-3" />}
                      {type === "bar" && <BarChart3 className="h-3 w-3" />}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-slate-700">Time Range:</span>
                  {(["1h", "6h", "24h"] as const).map((range) => (
                    <Button
                      key={range}
                      variant={timeRange === range ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeRange(range)}
                      className={timeRange === range ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>{renderChart()}</CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-teal-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-700">
                  <Gauge className="h-5 w-5" />
                  System Efficiency Monitor
                </CardTitle>
                <CardDescription>Real-time efficiency with government performance standards</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    efficiency: { label: "Efficiency", color: "#10b981" },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={efficiencyData}>
                      <RadialBar dataKey="value" cornerRadius={10} fill="#10b981" />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-700">
                        <tspan x="50%" dy="-0.5em" className="text-3xl font-bold">
                          {currentData.efficiency.toFixed(1)}%
                        </tspan>
                        <tspan x="50%" dy="1.2em" className="text-sm fill-slate-600">
                          System Efficiency
                        </tspan>
                        <tspan x="50%" dy="2.4em" className="text-xs fill-emerald-600">
                          Target: 85%
                        </tspan>
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700">
                  <PieChartIcon className="h-5 w-5" />
                  Energy Source Distribution
                </CardTitle>
                <CardDescription>Live renewable energy breakdown with capacity utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    solar: { label: "Solar", color: "#f59e0b" },
                    wind: { label: "Wind", color: "#06b6d4" },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Solar", value: currentData.solarGeneration, fill: "#f59e0b" },
                          { name: "Wind", value: currentData.windGeneration, fill: "#06b6d4" },
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent, value }) => `${name}: ${value}kW (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {[
                          { name: "Solar", value: currentData.solarGeneration, fill: "#f59e0b" },
                          { name: "Wind", value: currentData.windGeneration, fill: "#06b6d4" },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Target className="h-5 w-5" />
                Government Performance Standards Compliance
              </CardTitle>
              <CardDescription>
                Real-time efficiency tracking across all critical systems with regulatory compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemPerformanceData.map((item, index) => (
                  <div
                    key={index}
                    className="space-y-2 p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700">{item.metric}</span>
                        {item.status === "optimal" && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                        {item.status === "warning" && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-600 font-mono">
                          {item.current.toFixed(1)}/{item.target}
                        </span>
                        <Badge
                          variant={
                            item.efficiency > 95 ? "default" : item.efficiency > 85 ? "secondary" : "destructive"
                          }
                          className={
                            item.efficiency > 95
                              ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                              : item.efficiency > 85
                                ? "bg-amber-100 text-amber-700 border-amber-300"
                                : "bg-red-100 text-red-700 border-red-300"
                          }
                        >
                          {item.efficiency.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          item.efficiency > 95
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                            : item.efficiency > 85
                              ? "bg-gradient-to-r from-amber-500 to-amber-600"
                              : "bg-gradient-to-r from-red-500 to-red-600"
                        }`}
                        style={{ width: `${Math.min(100, (item.current / item.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="border-amber-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <Battery className="h-5 w-5" />
                Battery Performance & Grid Stability Analysis
              </CardTitle>
              <CardDescription>Comprehensive energy storage and grid integration monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #f59e0b",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="batteryLevel"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Battery Level (%)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="gridStability"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Grid Stability (%)"
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="powerQuality"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Power Quality (%)"
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Leaf className="h-5 w-5" />
                Environmental Impact & Sustainability Metrics
              </CardTitle>
              <CardDescription>Carbon offset tracking and environmental compliance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #10b981",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="carbonOffset"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.7}
                    name="Carbon Offset (kg CO₂)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="weatherImpact"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Weather Impact Factor (%)"
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid-analysis" className="space-y-6">
          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Zap className="h-5 w-5" />
                Grid Integration & Load Forecasting
              </CardTitle>
              <CardDescription>
                Advanced grid analysis with predictive load management and reliability metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #3b82f6",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="gridLoad" fill="#3b82f6" fillOpacity={0.7} name="Current Grid Load (kW)" />
                  <Line
                    type="monotone"
                    dataKey="loadForecast"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name="Load Forecast (kW)"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="systemReliability"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="System Reliability (%)"
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
