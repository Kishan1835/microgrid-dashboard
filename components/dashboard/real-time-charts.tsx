"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  Legend,
} from "recharts"
import { Activity, BarChart3, TrendingUp } from "lucide-react"
import type { RealTimeMetrics } from "@/lib/real-time-data"

interface RealTimeChartsProps {
  currentData: RealTimeMetrics
}

const generateDummyData = () => {
  const data = []
  const now = new Date()

  for (let i = 20; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 3 * 60 * 1000)
    data.push({
      time: timestamp.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      generation: 2500 + Math.sin(i * 0.3) * 300 + Math.random() * 100,
      consumption: 2400 + Math.cos(i * 0.2) * 200 + Math.random() * 80,
      solar: 1200 + Math.sin(i * 0.4) * 200 + Math.random() * 50,
      wind: 1100 + Math.cos(i * 0.3) * 150 + Math.random() * 40,
      battery: 85 + Math.sin(i * 0.1) * 10 + Math.random() * 5,
      efficiency: 88 + Math.cos(i * 0.2) * 8 + Math.random() * 3,
      surplus: 100 + Math.sin(i * 0.5) * 80 + Math.random() * 20,
    })
  }

  console.log("[v0] Generated dummy chart data:", data.slice(0, 3))
  return data
}

export function RealTimeCharts({ currentData }: RealTimeChartsProps) {
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line")
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h">("1h")

  const chartData = generateDummyData()

  console.log("[v0] Chart component rendering with data:", chartData.length, "points")

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="generation"
              stackId="1"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
              name="Generation (kW)"
            />
            <Area
              type="monotone"
              dataKey="consumption"
              stackId="2"
              stroke="#6366f1"
              fill="#6366f1"
              fillOpacity={0.6}
              name="Consumption (kW)"
            />
          </AreaChart>
        )

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend />
            <Bar dataKey="generation" fill="#10b981" name="Generation (kW)" />
            <Bar dataKey="consumption" fill="#6366f1" name="Consumption (kW)" />
          </BarChart>
        )

      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="generation"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
              name="Generation (kW)"
            />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#6366f1"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
              name="Consumption (kW)"
            />
            <ReferenceLine y={2500} stroke="#10b981" strokeDasharray="2 2" />
          </LineChart>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Real-time Generation vs Consumption */}
      <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <Activity className="h-5 w-5" />
                Power Generation & Consumption Analysis
              </CardTitle>
              <CardDescription>Real-time power flow with predictive analytics and historical trends</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Chart Type:</span>
                <Select value={chartType} onValueChange={(value: "line" | "area" | "bar") => setChartType(value)}>
                  <SelectTrigger className="w-32 bg-emerald-50 border-emerald-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">📈 Line</SelectItem>
                    <SelectItem value="area">📊 Area</SelectItem>
                    <SelectItem value="bar">📊 Bar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">Time Range:</span>
                <Select value={timeRange} onValueChange={(value: "1h" | "6h" | "24h") => setTimeRange(value)}>
                  <SelectTrigger className="w-24 bg-emerald-50 border-emerald-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">⏰ 1h</SelectItem>
                    <SelectItem value="6h">⏰ 6h</SelectItem>
                    <SelectItem value="24h">⏰ 24h</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Multi-metric Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <BarChart3 className="h-5 w-5" />
              Renewable Source Breakdown
            </CardTitle>
            <CardDescription>Real-time generation by renewable energy source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="solar"
                    stackId="1"
                    stroke="#eab308"
                    fill="#eab308"
                    fillOpacity={0.8}
                    name="Solar (kW)"
                  />
                  <Area
                    type="monotone"
                    dataKey="wind"
                    stackId="1"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
                    fillOpacity={0.8}
                    name="Wind (kW)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
              System Performance Metrics
            </CardTitle>
            <CardDescription>Real-time efficiency and battery performance tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    name="Efficiency (%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="battery"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                    name="Battery Level (%)"
                  />
                  <ReferenceLine y={90} stroke="#10b981" strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
