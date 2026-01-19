import * as React from "react"
import { cn } from "@/lib/utils"

interface ThirdPanelProps extends React.HTMLAttributes<HTMLDivElement> {}

const ThirdPanel = React.forwardRef<HTMLDivElement, ThirdPanelProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center w-full h-screen bg-background border-l",
          className
        )}
        {...props}
      >
        <div className="text-6xl">
          🤡
        </div>
      </div>
    )
  }
)
ThirdPanel.displayName = "ThirdPanel"

export { ThirdPanel }
