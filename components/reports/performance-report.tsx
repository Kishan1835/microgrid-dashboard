"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileText, Download, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import type { PerformanceReport } from "@/lib/historical-data"

interface PerformanceReportProps {
  report: PerformanceReport
  onExportPDF: () => void
}

export function PerformanceReportComponent({ report, onExportPDF }: PerformanceReportProps) {
  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? (
      <TrendingUp className="h-4 w-4 text-primary" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    )
  }

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? "text-primary" : "text-destructive"
  }

  const getComplianceIcon = (compliant: boolean) => {
    return compliant ? (
      <CheckCircle className="h-4 w-4 text-primary" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-destructive" />
    )
  }

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Performance Report
              </CardTitle>
              <CardDescription>
                Generated on {report.generatedAt.toLocaleDateString()} for period{" "}
                {report.timeRange.start.toLocaleDateString()} - {report.timeRange.end.toLocaleDateString()}
              </CardDescription>
            </div>
            <Button onClick={onExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>Key performance indicators and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Generation</div>
              <div className="text-2xl font-bold text-primary">
                {(report.summary.totalGeneration / 1000).toFixed(1)} MWh
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-1">Total Consumption</div>
              <div className="text-2xl font-bold">{(report.summary.totalConsumption / 1000).toFixed(1)} MWh</div>
            </div>

            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <div className="text-sm font-medium text-muted-foreground mb-1">Average Efficiency</div>
              <div className="text-2xl font-bold text-secondary">{report.summary.averageEfficiency.toFixed(1)}%</div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-sm font-medium text-muted-foreground mb-1">System Uptime</div>
              <div className="text-2xl font-bold text-primary">{report.summary.uptime.toFixed(1)}%</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Peak Generation</span>
              </div>
              <div className="text-lg font-bold">{report.summary.peakGeneration.value.toLocaleString()} kW</div>
              <div className="text-xs text-muted-foreground">
                {report.summary.peakGeneration.timestamp.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Peak Consumption</span>
              </div>
              <div className="text-lg font-bold">{report.summary.peakConsumption.value.toLocaleString()} kW</div>
              <div className="text-xs text-muted-foreground">
                {report.summary.peakConsumption.timestamp.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>Period-over-period performance analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getTrendIcon(report.trends.generationTrend)}
                <span className="text-sm font-medium">Generation Trend</span>
              </div>
              <div className={`text-2xl font-bold ${getTrendColor(report.trends.generationTrend)}`}>
                {report.trends.generationTrend >= 0 ? "+" : ""}
                {report.trends.generationTrend.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Compared to previous period</div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getTrendIcon(report.trends.consumptionTrend)}
                <span className="text-sm font-medium">Consumption Trend</span>
              </div>
              <div className={`text-2xl font-bold ${getTrendColor(report.trends.consumptionTrend)}`}>
                {report.trends.consumptionTrend >= 0 ? "+" : ""}
                {report.trends.consumptionTrend.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Compared to previous period</div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getTrendIcon(report.trends.efficiencyTrend)}
                <span className="text-sm font-medium">Efficiency Trend</span>
              </div>
              <div className={`text-2xl font-bold ${getTrendColor(report.trends.efficiencyTrend)}`}>
                {report.trends.efficiencyTrend >= 0 ? "+" : ""}
                {report.trends.efficiencyTrend.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Compared to previous period</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
          <CardDescription>Regulatory and industry standard compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getComplianceIcon(report.compliance.governmentStandards)}
                <div>
                  <div className="font-medium">Government Standards</div>
                  <div className="text-sm text-muted-foreground">Minimum 85% efficiency, 95% uptime</div>
                </div>
              </div>
              <Badge variant={report.compliance.governmentStandards ? "default" : "destructive"}>
                {report.compliance.governmentStandards ? "Compliant" : "Non-Compliant"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getComplianceIcon(report.compliance.industryBenchmarks)}
                <div>
                  <div className="font-medium">Industry Benchmarks</div>
                  <div className="text-sm text-muted-foreground">Renewable energy sector standards</div>
                </div>
              </div>
              <Badge variant={report.compliance.industryBenchmarks ? "default" : "destructive"}>
                {report.compliance.industryBenchmarks ? "Meeting" : "Below"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                {getComplianceIcon(report.compliance.environmentalTargets)}
                <div>
                  <div className="font-medium">Environmental Targets</div>
                  <div className="text-sm text-muted-foreground">Carbon offset and sustainability goals</div>
                </div>
              </div>
              <Badge variant={report.compliance.environmentalTargets ? "default" : "destructive"}>
                {report.compliance.environmentalTargets ? "Achieved" : "Not Met"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {report.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Actionable insights for performance improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.recommendations.map((recommendation, index) => (
                <Alert key={index}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Recommendation {index + 1}</AlertTitle>
                  <AlertDescription>{recommendation}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Environmental Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact</CardTitle>
          <CardDescription>Carbon footprint and sustainability metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {(report.summary.carbonOffset / 1000).toFixed(1)} tonnes
              </div>
              <div className="text-lg font-medium mb-4">CO₂ Emissions Avoided</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div>
                  <div className="font-medium">Equivalent to</div>
                  <div>{Math.round(report.summary.carbonOffset / 22)} trees planted</div>
                </div>
                <div>
                  <div className="font-medium">Or</div>
                  <div>{Math.round(report.summary.carbonOffset / 404)} cars off road for 1 year</div>
                </div>
                <div>
                  <div className="font-medium">Or</div>
                  <div>{Math.round((report.summary.carbonOffset / 1000) * 2.3)} homes powered for 1 year</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
