"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ComplianceAuditService, { type AuditLog, type ComplianceReport } from "@/lib/compliance-audit"
import type { User } from "@clerk/nextjs/server"
import {
  Shield,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Database,
  Settings,
  Eye,
} from "lucide-react"

interface ComplianceDashboardProps {
  user: any // Change User to any to match Clerk's User object
}

export function ComplianceDashboard({ user }: ComplianceDashboardProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  useEffect(() => {
    const complianceService = ComplianceAuditService.getInstance()
    setAuditLogs(complianceService.getAuditLogs(50))
  }, [])

  const handleGenerateComplianceReport = async () => {
    setIsGeneratingReport(true)
    const complianceService = ComplianceAuditService.getInstance()

    // Generate report for last 30 days
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)

    setTimeout(() => {
      const report = complianceService.generateComplianceReport(startDate, endDate)
      setComplianceReport(report)
      setIsGeneratingReport(false)
    }, 1500)
  }

  const handleExportAuditLogs = (format: "csv" | "json") => {
    const complianceService = ComplianceAuditService.getInstance()
    const data = complianceService.exportAuditLogs(format)

    const blob = new Blob([data], {
      type: format === "csv" ? "text/csv" : "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit_logs_${new Date().toISOString().split("T")[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "authentication":
        return <Users className="h-4 w-4" />
      case "configuration":
        return <Settings className="h-4 w-4" />
      case "data_access":
        return <Database className="h-4 w-4" />
      case "system":
        return <Shield className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Compliance & Audit Management</h2>
          <p className="text-muted-foreground">Government-grade security monitoring and compliance reporting</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Shield className="h-3 w-3 mr-1" />
            FISMA Compliant
          </Badge>
          <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
            SOC 2 Type II
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Report</TabsTrigger>
          <TabsTrigger value="export">Export & Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events (30d)</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditLogs.length}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Events</CardTitle>
                <Shield className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {auditLogs.filter((log) => log.category === "authentication").length}
                </div>
                <p className="text-xs text-muted-foreground">Authentication & access</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <CheckCircle className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">94.2%</div>
                <p className="text-xs text-muted-foreground">Above target (90%)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Violations</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">1</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Latest authentication and security-related activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(log.category)}
                      <div>
                        <div className="font-medium">{log.action}</div>
                        <div className="text-sm text-muted-foreground">
                          {log.userName} • {log.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getSeverityColor(log.severity) as any}>{log.severity}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit-logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Complete system activity log with detailed tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.slice(0, 20).map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.timestamp.toLocaleString()}</TableCell>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(log.category)}
                          <span className="capitalize">{log.category.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{log.ipAddress}</TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(log.severity) as any}>{log.severity}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reporting</CardTitle>
              <CardDescription>Generate comprehensive compliance reports for regulatory requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={handleGenerateComplianceReport}
                disabled={isGeneratingReport}
                className="w-full md:w-auto"
              >
                {isGeneratingReport ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Generating Report...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate 30-Day Compliance Report
                  </>
                )}
              </Button>

              {complianceReport && (
                <div className="space-y-4 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-secondary">{complianceReport.complianceScore}%</div>
                          <div className="text-sm text-muted-foreground">Compliance Score</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{complianceReport.totalEvents}</div>
                          <div className="text-sm text-muted-foreground">Total Events</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-destructive">
                            {complianceReport.violations.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Violations</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {complianceReport.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-secondary mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Export & Archival</CardTitle>
              <CardDescription>Export audit logs and compliance data for external analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleExportAuditLogs("csv")} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </Button>
                <Button variant="outline" onClick={() => handleExportAuditLogs("json")} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export as JSON
                </Button>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Data Retention Policy</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Audit logs retained for 10 years (FISMA requirement)</li>
                  <li>• Compliance reports archived quarterly</li>
                  <li>• Security events backed up to secure government cloud</li>
                  <li>• Data encrypted at rest and in transit</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
