"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Switch } from "@/components/ui/switch"

export function ModeToggle() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDarkMode = resolvedTheme === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Switch
      aria-label="Toggle dark mode"
      checked={isDarkMode}
      onCheckedChange={(checked) =>
        setTheme(checked ? 'dark' : 'light')
      }
      className="h-6 w-12"
    />
  )
}
