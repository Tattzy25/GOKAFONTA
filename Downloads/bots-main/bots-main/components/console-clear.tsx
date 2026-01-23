"use client"

import { Button } from "@/components/ui/button"
import { Logger } from "@/components/console-logs"

export function ConsoleClear() {
  const handleClear = () => {
    Logger.clearLogs()
  }

  return (
    <Button
      variant="default"
      size="default"
      onClick={handleClear}
      className="shrink-0"
    >
      Clear
    </Button>
  )
}
