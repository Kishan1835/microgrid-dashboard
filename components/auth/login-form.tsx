"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, Zap } from "lucide-react"
import { SignIn } from "@clerk/nextjs"

interface LoginFormProps {
  onLoginSuccess: () => void
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <SignIn
        routing="hash"
        appearance={{
          variables: {
            colorPrimary: "oklch(0.52 0.15 142.5)", // Matches your --primary green
            colorText: "oklch(0.27 0.01 258.34)",   // Matches your --foreground dark gray
            colorBackground: "oklch(1 0 0)",      // Matches your --card white
          },
          elements: {
            card: "shadow-lg border border-emerald-200",
            headerTitle: "text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent",
            headerSubtitle: "text-slate-600",
            formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700",
            socialButtonsBlockButton: "border-emerald-200",
            footerActionLink: "text-emerald-600 hover:text-emerald-700",
          }
        }} />
    </div>
  )
}
