"use client"

import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { MarkdownRenderer } from "@/components/markdown/markdown-renderer"

interface MarkdownSplitEditorProps {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  sourceLabel?: string
  previewLabel?: string
  minHeightClassName?: string
  className?: string
  textareaClassName?: string
  previewClassName?: string
  disabled?: boolean
}

export function MarkdownSplitEditor({
  id,
  value,
  onChange,
  placeholder = "支持 Markdown 与 LaTeX 输入（如 $E=mc^2$）",
  sourceLabel = "源代码",
  previewLabel = "渲染预览",
  minHeightClassName = "min-h-[220px]",
  className,
  textareaClassName,
  previewClassName,
  disabled = false,
}: MarkdownSplitEditorProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-2", className)}>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{sourceLabel}</p>
        <Textarea
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={cn("resize-y font-mono text-sm leading-6", minHeightClassName, textareaClassName)}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{previewLabel}</p>
        <div className={cn("overflow-auto rounded-md border bg-muted/20 p-4", minHeightClassName, previewClassName)}>
          <MarkdownRenderer content={value} emptyFallback="在左侧输入 Markdown 后，这里会实时预览。" />
        </div>
      </div>
    </div>
  )
}
