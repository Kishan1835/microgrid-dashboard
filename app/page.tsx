"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { UserMenu } from "@/components/auth/user-menu"
import { UserManagement } from "@/components/auth/user-management"
import { AdvancedMetrics } from "@/components/dashboard/advanced-metrics"
import { RealTimeCharts } from "@/components/dashboard/real-time-charts"
import { HistoricalAnalysis } from "@/components/reports/historical-analysis"
import { PerformanceReportComponent } from "@/components/reports/performance-report"
import { AlertCenter } from "@/components/alerts/alert-center"
import { AlertNotification } from "@/components/alerts/alert-notification"
import { AuthService, type User } from "@/lib/auth"
import RealTimeDataService, { type RealTimeMetrics } from "@/lib/real-time-data"
import HistoricalDataService, { type PerformanceReport } from "@/lib/historical-data"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AdminPanel } from "@/components/admin/admin-panel"
import { ComplianceDashboard } from "@/components/compliance/compliance-dashboard"
import { EnhancedRealTimeCharts } from "@/components/dashboard/enhanced-real-time-charts"
import {
  Zap,
  Battery,
  Sun,
  Wind,
  Leaf,
  TrendingUp,
  Thermometer,
  Droplets,
  Eye,
  Calendar,
  BarChart3,
  FileText,
  Bell,
  Settings,
  Shield,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { useUser, useAuth } from "@clerk/nextjs"

// Mock data for the dashboard
const alerts = [
  {
    id: 1,
    type: "warning",
    title: "High Consumption",
    message: "Energy consumption 15% above average",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "info",
    title: "Maintenance Due",
    message: "Wind turbine maintenance scheduled for tomorrow",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "success",
    title: "Peak Generation",
    message: "Solar panels reached 95% efficiency",
    time: "3 hours ago",
  },
]

export default function MicrogridDashboard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [timeframe, setTimeframe] = useState("day")
  const [selectedMetric, setSelectedMetric] = useState("overview")
  const [realTimeData, setRealTimeData] = useState<RealTimeMetrics | null>(null)
  const [showAdvancedAnalytics, setShowAdvancedAnalytics] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [currentReport, setCurrentReport] = useState<PerformanceReport | null>(null)

  useEffect(() => {
    // Clerk's useUser hook handles loading and user state
    // We can remove the local isLoading state if Clerk handles it comprehensively
    if (isLoaded) {
      setIsLoading(false)
    }
  }, [isLoaded])

  useEffect(() => {
    if (isSignedIn && user) {
      const dataService = RealTimeDataService.getInstance(user?.publicMetadata?.role as string)
      const unsubscribe = dataService.subscribe((data) => {
        setRealTimeData(data)
      })

      return unsubscribe
    }
  }, [isSignedIn, user])

  const handleLoginSuccess = () => {
    // With Clerk, login success is handled automatically by the ClerkProvider
    // and the useUser hook will update accordingly.
    // No action needed here.
  }

  const handleLogout = async () => {
    await signOut()
  }

  const handleGenerateReport = (startDate: Date, endDate: Date) => {
    try {
      const historicalService = HistoricalDataService.getInstance(user?.publicMetadata?.role as string)
      const report = historicalService.generatePerformanceReport(startDate, endDate)
      setCurrentReport(report)
      setActiveTab("reports")
    } catch (error) {
      console.error("Failed to generate report:", error)
    }
  }

  const handleExportPDF = () => {
    // In a real implementation, you'd use a library like jsPDF or Puppeteer
    console.log("Exporting report to PDF...")
    alert("PDF export functionality would be implemented here")
  }

  const handleOpenAlertCenter = () => {
    setActiveTab("alerts")
  }

  const energyFlowData = [
    { time: "00:00", generation: 2100, consumption: 1800, flow: 300 },
    { time: "04:00", generation: 1950, consumption: 1600, flow: 350 },
    { time: "08:00", generation: 2400, consumption: 2000, flow: 400 },
    { time: "12:00", generation: 2847, consumption: 2156, flow: 691 },
    { time: "16:00", generation: 2650, consumption: 2300, flow: 350 },
    { time: "20:00", generation: 2200, consumption: 1900, flow: 300 },
  ]

  const efficiencyData = [
    { time: "6h ago", efficiency: 87.2, target: 85 },
    { time: "5h ago", efficiency: 88.1, target: 85 },
    { time: "4h ago", efficiency: 89.3, target: 85 },
    { time: "3h ago", efficiency: 88.7, target: 85 },
    { time: "2h ago", efficiency: 89.8, target: 85 },
    { time: "1h ago", efficiency: 89.1, target: 85 },
    { time: "Now", efficiency: realTimeData ? realTimeData.efficiency : 89.5, target: 85 },
  ]

  const currentData = realTimeData || {
    timestamp: new Date(),
    totalGeneration: 2847,
    totalConsumption: 2156,
    surplus: 691,
    batteryLevel: 78,
    batteryStatus: "charging" as const,
    solarGeneration: 1654,
    windGeneration: 1193,
    gridConnection: "connected" as const,
    efficiency: 89.5,
    carbonOffset: 1247,
    systemHealth: 92.3,
    predictedGeneration: 3100,
    peakDemandForecast: 2800,
  }

  const dataService = RealTimeDataService.getInstance(user?.publicMetadata?.role as string)
  const advancedAnalytics = dataService.getAdvancedAnalytics()

  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700">Loading Government Energy Portal...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
            Government Energy Portal
          </h1>
          <p className="text-slate-600">Advanced Renewable Energy Microgrid Monitoring System</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-300">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
              Live Data Stream
            </Badge>
            <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">
              Classification: {user?.publicMetadata?.role === "admin" ? "RESTRICTED" : "OFFICIAL USE ONLY"}
            </Badge>
            <Badge variant="outline" className="bg-teal-100 text-teal-700 border-teal-300">
              System Health: {currentData.systemHealth.toFixed(1)}%
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AlertNotification user={user} onOpenAlertCenter={handleOpenAlertCenter} />
          <UserMenu user={user} onLogout={handleLogout} onOpenUserManagement={() => setShowUserManagement(true)} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white/70 backdrop-blur-sm border border-emerald-200">
          <TabsTrigger
            value="dashboard"
            className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            <BarChart3 className="h-4 w-4" />
            Live Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            <TrendingUp className="h-4 w-4" />
            Advanced Analytics
          </TabsTrigger>
          <TabsTrigger
            value="historical"
            className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            <Calendar className="h-4 w-4" />
            Historical Analysis
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          {user?.publicMetadata?.role === "admin" && (
            <TabsTrigger
              value="admin"
              className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
            >
              <Settings className="h-4 w-4" />
              Admin
            </TabsTrigger>
          )}
          {user?.publicMetadata?.role === "admin" && (
            <TabsTrigger
              value="compliance"
              className="flex items-center gap-2 data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
            >
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="border-emerald-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Total Generation</CardTitle>
                <Zap className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700">
                  {currentData.totalGeneration.toLocaleString()} kW
                </div>
                <p className="text-xs text-slate-600">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  Efficiency: {currentData.efficiency.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Consumption</CardTitle>
                <Eye className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-700">
                  {currentData.totalConsumption.toLocaleString()} kW
                </div>
                <p className="text-xs text-slate-600">
                  Predicted peak: {currentData.peakDemandForecast.toLocaleString()} kW
                </p>
              </CardContent>
            </Card>

            <Card
              className={`${currentData.surplus > 0 ? "border-teal-200 bg-teal-50/80" : "border-red-200 bg-red-50/80"} backdrop-blur-sm shadow-lg`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Energy Balance</CardTitle>
                {currentData.surplus > 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-teal-600" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${currentData.surplus > 0 ? "text-teal-700" : "text-red-700"}`}>
                  {currentData.surplus > 0 ? "+" : ""}
                  {currentData.surplus} kW
                </div>
                <p className="text-xs text-slate-600">
                  {currentData.surplus > 0 ? "Feeding back to grid" : "Drawing from grid"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">Battery Level</CardTitle>
                <Battery className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-700">{currentData.batteryLevel.toFixed(1)}%</div>
                <Progress value={currentData.batteryLevel} className="mt-2 bg-amber-100" />
                <p className="text-xs text-slate-600 mt-1 capitalize">{currentData.batteryStatus}</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-700">System Health</CardTitle>
                <Activity className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700">{currentData.systemHealth.toFixed(1)}%</div>
                <Progress value={currentData.systemHealth} className="mt-2 bg-emerald-100" />
                <p className="text-xs text-slate-600 mt-1">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Charts */}
          {realTimeData && (
            <div className="space-y-6">
              <RealTimeCharts currentData={realTimeData} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-emerald-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-700">
                  <Leaf className="h-5 w-5" />
                  Energy Generation Sources
                </CardTitle>
                <CardDescription>Current power generation breakdown by renewable source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sun className="h-5 w-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">Solar Power</span>
                        </div>
                        <span className="text-xl font-bold text-yellow-700">{currentData.solarGeneration} kW</span>
                      </div>
                      <Progress
                        value={(currentData.solarGeneration / currentData.totalGeneration) * 100}
                        className="h-3 bg-yellow-100"
                      />
                      <p className="text-sm text-yellow-700 mt-2">
                        {((currentData.solarGeneration / currentData.totalGeneration) * 100).toFixed(1)}% of total
                        generation
                      </p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Wind className="h-5 w-5 text-sky-600" />
                          <span className="font-semibold text-sky-800">Wind Power</span>
                        </div>
                        <span className="text-xl font-bold text-sky-700">{currentData.windGeneration} kW</span>
                      </div>
                      <Progress
                        value={(currentData.windGeneration / currentData.totalGeneration) * 100}
                        className="h-3 bg-sky-100"
                      />
                      <p className="text-sm text-sky-700 mt-2">
                        {((currentData.windGeneration / currentData.totalGeneration) * 100).toFixed(1)}% of total
                        generation
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ChartContainer
                      config={{
                        solar: { label: "Solar", color: "#eab308" },
                        wind: { label: "Wind", color: "#0ea5e9" },
                      }}
                      className="h-64 w-64"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Solar", value: currentData.solarGeneration, color: "#eab308" },
                              { name: "Wind", value: currentData.windGeneration, color: "#0ea5e9" },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={100}
                            dataKey="value"
                            stroke="#fff"
                            strokeWidth={3}
                          >
                            {[
                              { name: "Solar", value: currentData.solarGeneration, color: "#eab308" },
                              { name: "Wind", value: currentData.windGeneration, color: "#0ea5e9" },
                            ].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environmental Conditions */}
            <Card className="border-slate-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-700">
                  <Thermometer className="h-5 w-5" />
                  Environmental Data
                </CardTitle>
                <CardDescription>Current weather and environmental conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
                    <Thermometer className="h-6 w-6 mx-auto mb-2 text-red-600" />
                    <div className="text-lg font-bold text-red-700">24°C</div>
                    <div className="text-xs text-red-600">Temperature</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                    <Droplets className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-bold text-blue-700">62%</div>
                    <div className="text-xs text-blue-600">Humidity</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg border border-sky-200">
                    <Wind className="h-6 w-6 mx-auto mb-2 text-sky-600" />
                    <div className="text-lg font-bold text-sky-700">12.5 m/s</div>
                    <div className="text-xs text-sky-600">Wind Speed</div>
                  </div>

                  <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                    <div className="text-lg font-bold text-yellow-700">850 W/m²</div>
                    <div className="text-xs text-yellow-600">Solar Irradiance</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium text-emerald-700">CO₂ Saved Today</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">{currentData.carbonOffset} kg</div>
                  <div className="text-xs text-emerald-600">Equivalent to planting 56 trees</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {realTimeData && <EnhancedRealTimeCharts currentData={realTimeData} />}
          {realTimeData && advancedAnalytics && (
            <AdvancedMetrics analytics={advancedAnalytics} efficiency={realTimeData.efficiency} />
          )}
        </TabsContent>

        <TabsContent value="historical" className="space-y-6">
          <HistoricalAnalysis onGenerateReport={handleGenerateReport} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {currentReport ? (
            <PerformanceReportComponent report={currentReport} onExportPDF={handleExportPDF} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Performance Reports</CardTitle>
                <CardDescription>
                  Generate comprehensive performance reports from the Historical Analysis tab
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No reports generated yet. Use the Historical Analysis tab to create detailed performance reports.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <AlertCenter user={user} />
        </TabsContent>

        {user?.publicMetadata?.role === "admin" && (
          <TabsContent value="admin" className="space-y-6">
            <AdminPanel user={user} />
          </TabsContent>
        )}

        {user?.publicMetadata?.role === "admin" && (
          <TabsContent value="compliance" className="space-y-6">
            <ComplianceDashboard user={user} />
          </TabsContent>
        )}
      </Tabs>

      {/* User Management */}
      <UserManagement isOpen={showUserManagement} onClose={() => setShowUserManagement(false)} />
    </div>
  )
}
