"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function Slider({ value, onChange, min = 0, max = 10, step = 1, className }: SliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [trackRect, setTrackRect] = React.useState<DOMRect | null>(null)

  const percentage = ((value - min) / (max - min)) * 100

  const getTrackRect = React.useCallback(() => {
    return trackRef.current?.getBoundingClientRect() || null
  }, [])

  const updateValueFromPosition = React.useCallback(
    (clientX: number, rectOverride?: DOMRect) => {
      const rect = rectOverride || trackRect
      if (!rect) return

      const trackWidth = rect.width
      const offsetX = clientX - rect.left
      const clampedX = Math.max(0, Math.min(offsetX, trackWidth))
      const newPercentage = clampedX / trackWidth
      const rawValue = min + newPercentage * (max - min)
      const steppedValue = Math.round(rawValue / step) * step
      const finalValue = Math.max(min, Math.min(max, steppedValue))

      onChange(finalValue)
    },
    [trackRect, min, max, step, onChange]
  )

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const rect = getTrackRect()
    if (!rect) return

    setTrackRect(rect)
    setIsDragging(true)
    updateValueFromPosition(e.clientX, rect)
  }

  React.useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = trackRect || getTrackRect()
      if (!rect) return
      if (!trackRect) setTrackRect(rect)
      updateValueFromPosition(e.clientX, rect)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setTrackRect(null)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [getTrackRect, isDragging, trackRect, updateValueFromPosition])

  return (
    <div className={cn("relative select-none", className)}>
      {/* Track */}
      <div
        ref={trackRef}
        className="h-3 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden"
        onMouseDown={handleMouseDown}
      >
        {/* Filled track */}
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-75"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Thumb - with magnetic feel */}
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 w-7 h-7 bg-white rounded-full shadow-lg cursor-grab flex items-center justify-center border-2 border-amber-500 transition-transform duration-150",
          isDragging ? "cursor-grabbing scale-110 shadow-xl ring-4 ring-amber-200" : "hover:scale-105"
        )}
        onMouseDown={handleMouseDown}
        style={{
          left: `calc(${percentage}% - 14px)`,
        }}
      >
        {/* Inner dot */}
        <div className="w-2 h-2 bg-amber-500 rounded-full" />
      </div>

      {/* Value display */}
      <div
        className={cn(
          "absolute -top-8 px-2 py-1 bg-amber-500 text-white text-sm font-medium rounded transition-all duration-150",
          isDragging ? "opacity-100 scale-100" : "opacity-0 scale-75"
        )}
        style={{
          left: `calc(${percentage}% - 20px)`,
        }}
      >
        {value}
      </div>
    </div>
  )
}
