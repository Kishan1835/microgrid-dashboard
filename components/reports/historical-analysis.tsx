"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
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
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Calendar, Download, TrendingUp, TrendingDown, BarChart3, FileText } from "lucide-react"
import HistoricalDataService, { type HistoricalDataPoint } from "@/lib/historical-data"
import type { DateRange } from "react-day-picker"

interface HistoricalAnalysisProps {
  onGenerateReport: (startDate: Date, endDate: Date) => void
}

export function HistoricalAnalysis({ onGenerateReport }: HistoricalAnalysisProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  })
  const [aggregation, setAggregation] = useState<"hourly" | "daily" | "weekly">("daily")
  const [data, setData] = useState<HistoricalDataPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const historicalService = HistoricalDataService.getInstance()

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      loadData()
    }
  }, [dateRange, aggregation])

  const loadData = async () => {
    if (!dateRange?.from || !dateRange?.to) return

    setIsLoading(true)
    try {
      const historicalData = historicalService.getHistoricalData(dateRange.from, dateRange.to, aggregation)
      setData(historicalData)
    } catch (error) {
      console.error("Failed to load historical data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatChartData = () => {
    return data.map((d) => ({
      time:
        aggregation === "hourly"
          ? d.timestamp.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit" })
          : d.timestamp.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      generation: d.totalGeneration,
      consumption: d.totalConsumption,
      solar: d.solarGeneration,
      wind: d.windGeneration,
      efficiency: d.efficiency,
      battery: d.batteryLevel,
      carbonOffset: d.carbonOffset,
    }))
  }

  const calculateSummaryStats = () => {
    if (data.length === 0) return null

    const totalGeneration = data.reduce((sum, d) => sum + d.totalGeneration, 0)
    const totalConsumption = data.reduce((sum, d) => sum + d.totalConsumption, 0)
    const avgEfficiency = data.reduce((sum, d) => sum + d.efficiency, 0) / data.length
    const totalCarbonOffset = data.reduce((sum, d) => sum + d.carbonOffset, 0)
    const avgSystemHealth = data.reduce((sum, d) => sum + d.systemHealth, 0) / data.length

    // Calculate trends
    const midPoint = Math.floor(data.length / 2)
    const firstHalf = data.slice(0, midPoint)
    const secondHalf = data.slice(midPoint)

    const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.totalGeneration, 0) / firstHalf.length
    const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.totalGeneration, 0) / secondHalf.length
    const trend = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100

    return {
      totalGeneration,
      totalConsumption,
      avgEfficiency,
      totalCarbonOffset,
      avgSystemHealth,
      trend,
    }
  }

  const handleExport = (format: "csv" | "json") => {
    try {
      const exportData = historicalService.exportData(data, format)
      const blob = new Blob([exportData as string], {
        type: format === "csv" ? "text/csv" : "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `microgrid-data-${dateRange?.from?.toISOString().split("T")[0]}-to-${dateRange?.to?.toISOString().split("T")[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const chartData = formatChartData()
  const stats = calculateSummaryStats()

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Historical Data Analysis
          </CardTitle>
          <CardDescription>Analyze historical performance data and generate comprehensive reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Aggregation</label>
              <Select
                value={aggregation}
                onValueChange={(value: "hourly" | "daily" | "weekly") => setAggregation(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport("csv")} disabled={data.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport("json")} disabled={data.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                JSON
              </Button>
              <Button
                onClick={() => dateRange?.from && dateRange?.to && onGenerateReport(dateRange.from, dateRange.to)}
                disabled={!dateRange?.from || !dateRange?.to}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Generation</span>
              </div>
              <div className="text-2xl font-bold text-primary">{(stats.totalGeneration / 1000).toFixed(1)} MWh</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Consumption</span>
              </div>
              <div className="text-2xl font-bold">{(stats.totalConsumption / 1000).toFixed(1)} MWh</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Avg Efficiency</span>
              </div>
              <div className="text-2xl font-bold text-secondary">{stats.avgEfficiency.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Carbon Offset</span>
              </div>
              <div className="text-2xl font-bold text-primary">{(stats.totalCarbonOffset / 1000).toFixed(1)} t</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {stats.trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-primary" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span className="text-sm font-medium">Generation Trend</span>
              </div>
              <div className={`text-2xl font-bold ${stats.trend >= 0 ? "text-primary" : "text-destructive"}`}>
                {stats.trend >= 0 ? "+" : ""}
                {stats.trend.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generation vs Consumption</CardTitle>
            <CardDescription>Historical energy flow analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                generation: { label: "Generation (kW)", color: "hsl(var(--chart-1))" },
                consumption: { label: "Consumption (kW)", color: "hsl(var(--chart-5))" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="generation"
                    stroke="var(--color-generation)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="consumption"
                    stroke="var(--color-consumption)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Sources</CardTitle>
            <CardDescription>Solar and wind generation breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                solar: { label: "Solar (kW)", color: "hsl(var(--chart-1))" },
                wind: { label: "Wind (kW)", color: "hsl(var(--chart-2))" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="solar"
                    stackId="1"
                    stroke="var(--color-solar)"
                    fill="var(--color-solar)"
                    fillOpacity={0.8}
                  />
                  <Area
                    type="monotone"
                    dataKey="wind"
                    stackId="1"
                    stroke="var(--color-wind)"
                    fill="var(--color-wind)"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Efficiency</CardTitle>
            <CardDescription>Efficiency trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                efficiency: { label: "Efficiency (%)", color: "hsl(var(--chart-1))" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[70, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="var(--color-efficiency)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Carbon Offset</CardTitle>
            <CardDescription>Environmental impact over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                carbonOffset: { label: "Carbon Offset (kg)", color: "hsl(var(--chart-1))" },
              }}
              className="h-80"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="carbonOffset" fill="var(--color-carbonOffset)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
