import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
          {
            "bg-gray-900 text-white hover:bg-gray-800": variant === "default",
            "bg-gray-100 text-gray-800 hover:bg-gray-200": variant === "secondary",
            "bg-red-100 text-red-800 hover:bg-red-200": variant === "destructive",
            "bg-green-100 text-green-800 hover:bg-green-200": variant === "success",
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-200": variant === "warning",
            "border border-gray-300 text-gray-700": variant === "outline",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
