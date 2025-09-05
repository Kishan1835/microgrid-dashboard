"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Settings,
  Save,
  Download,
  Shield,
  Database,
  Bell,
  FileText,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import SystemConfigurationService, { type SystemConfiguration } from "@/lib/system-config"
import type { User } from "@clerk/nextjs/server"

interface SystemConfigurationProps {
  user: any // Change User to any to match Clerk's User object
}

export function SystemConfigurationPanel({ user }: SystemConfigurationProps) {
  const [configurations, setConfigurations] = useState<SystemConfiguration[]>([])
  const [activeCategory, setActiveCategory] = useState<SystemConfiguration["category"]>("general")
  const [hasChanges, setHasChanges] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")

  const configService = SystemConfigurationService.getInstance()

  useEffect(() => {
    loadConfigurations()
  }, [activeCategory])

  const loadConfigurations = () => {
    const configs = configService.getConfigurations(activeCategory)
    setConfigurations(configs)
    setHasChanges(false)
  }

  const handleConfigChange = (configId: string, value: any) => {
    setConfigurations((prev) => prev.map((config) => (config.id === configId ? { ...config, value } : config)))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setSaveStatus("saving")

    try {
      let allSuccess = true

      for (const config of configurations) {
        const success = configService.updateConfiguration(config.id, config.value, user.emailAddresses[0].emailAddress)
        if (!success) {
          allSuccess = false
        }
      }

      if (allSuccess) {
        setSaveStatus("saved")
        setHasChanges(false)
        setTimeout(() => setSaveStatus("idle"), 2000)
      } else {
        setSaveStatus("error")
        setTimeout(() => setSaveStatus("idle"), 3000)
      }
    } catch (error) {
      setSaveStatus("error")
      setTimeout(() => setSaveStatus("idle"), 3000)
    }
  }

  const handleExport = () => {
    const exportData = configService.exportConfiguration()
    const blob = new Blob([exportData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `system-config-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const renderConfigInput = (config: SystemConfiguration) => {
    const isDisabled = config.isReadOnly || user?.publicMetadata?.role === "viewer"

    switch (config.dataType) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={config.id}
              checked={config.value}
              onCheckedChange={(checked) => handleConfigChange(config.id, checked)}
              disabled={isDisabled}
            />
            <Label htmlFor={config.id} className="text-sm">
              {config.value ? "Enabled" : "Disabled"}
            </Label>
          </div>
        )

      case "number":
        return (
          <Input
            type="number"
            value={config.value}
            onChange={(e) => handleConfigChange(config.id, Number(e.target.value))}
            disabled={isDisabled}
            min={config.validationRules?.min}
            max={config.validationRules?.max}
          />
        )

      case "password":
        return (
          <Input
            type="password"
            value={config.value}
            onChange={(e) => handleConfigChange(config.id, e.target.value)}
            disabled={isDisabled}
            placeholder="••••••••"
          />
        )

      case "string":
        if (config.validationRules?.options) {
          return (
            <Select
              value={config.value}
              onValueChange={(value) => handleConfigChange(config.id, value)}
              disabled={isDisabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.validationRules.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }
        return (
          <Input
            type="text"
            value={config.value}
            onChange={(e) => handleConfigChange(config.id, e.target.value)}
            disabled={isDisabled}
          />
        )

      default:
        return (
          <Input
            type="text"
            value={JSON.stringify(config.value)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value)
                handleConfigChange(config.id, parsed)
              } catch {
                // Invalid JSON, don't update
              }
            }}
            disabled={isDisabled}
          />
        )
    }
  }

  const getCategoryIcon = (category: SystemConfiguration["category"]) => {
    switch (category) {
      case "general":
        return <Settings className="h-4 w-4" />
      case "security":
        return <Shield className="h-4 w-4" />
      case "alerts":
        return <Bell className="h-4 w-4" />
      case "integrations":
        return <Database className="h-4 w-4" />
      case "compliance":
        return <FileText className="h-4 w-4" />
      default:
        return <Settings className="h-4 w-4" />
    }
  }

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case "saving":
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
      case "saved":
        return <CheckCircle className="h-4 w-4 text-primary" />
      case "error":
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return <Save className="h-4 w-4" />
    }
  }

  if (user?.publicMetadata?.role === "viewer") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            System Configuration
          </CardTitle>
          <CardDescription>View system configuration settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You do not have permission to modify system configurations. Contact an administrator for changes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                System Configuration
              </CardTitle>
              <CardDescription>Manage system settings, security, and operational parameters</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Config
              </Button>
              {hasChanges && (
                <Button onClick={handleSave} disabled={saveStatus === "saving"}>
                  {getSaveStatusIcon()}
                  <span className="ml-2">
                    {saveStatus === "saving"
                      ? "Saving..."
                      : saveStatus === "saved"
                        ? "Saved"
                        : saveStatus === "error"
                          ? "Error"
                          : "Save Changes"}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs
        value={activeCategory}
        onValueChange={(value) => setActiveCategory(value as SystemConfiguration["category"])}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            {getCategoryIcon("general")}
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            {getCategoryIcon("security")}
            Security
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            {getCategoryIcon("alerts")}
            Alerts
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            {getCategoryIcon("integrations")}
            Integrations
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            {getCategoryIcon("compliance")}
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getCategoryIcon(activeCategory)}
                {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Settings
              </CardTitle>
              <CardDescription>Configure {activeCategory} related system parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {configurations.map((config) => (
                  <div key={config.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor={config.id} className="text-sm font-medium">
                          {config.key}
                        </Label>
                        <p className="text-xs text-muted-foreground">{config.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {config.isRequired && (
                          <Badge variant="outline" className="text-xs">
                            Required
                          </Badge>
                        )}
                        {config.isReadOnly && (
                          <Badge variant="secondary" className="text-xs">
                            Read Only
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="max-w-md">{renderConfigInput(config)}</div>

                    {config.validationRules && (
                      <div className="text-xs text-muted-foreground">
                        {config.validationRules.min !== undefined && config.validationRules.max !== undefined && (
                          <span>
                            Range: {config.validationRules.min} - {config.validationRules.max}
                          </span>
                        )}
                        {config.validationRules.pattern && <span>Pattern: {config.validationRules.pattern}</span>}
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Last modified: {config.lastModified.toLocaleString()} by {config.modifiedBy}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
