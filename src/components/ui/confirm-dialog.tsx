"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  variant?: "default" | "danger" | "warning"
  isLoading?: boolean
}

/**
 * Confirmation dialog for dangerous operations
 * Provides a second layer of confirmation for high-risk user actions
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const handleConfirm = async () => {
    await onConfirm()
    onOpenChange(false)
  }

  const buttonVariant = variant === "danger" ? "destructive" : "default"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Hook for managing confirmation dialog state
 */
export function useConfirmDialog() {
  const [dialogState, setDialogState] = useState<{
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: "default" | "danger" | "warning"
    onConfirm?: () => void | Promise<void>
    isLoading?: boolean
  }>({
    open: false,
    title: "",
    description: "",
  })

  const confirm = ({
    title,
    description,
    confirmLabel,
    cancelLabel,
    variant = "default",
    onConfirm,
  }: {
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: "default" | "danger" | "warning"
    onConfirm?: () => void | Promise<void>
  }) => {
    return new Promise<boolean>((resolve) => {
      setDialogState({
        open: true,
        title,
        description,
        confirmLabel,
        cancelLabel,
        variant,
        onConfirm: async () => {
          if (onConfirm) {
            await onConfirm()
          }
          resolve(true)
        },
      })
    })
  }

  const close = () => {
    setDialogState((prev) => ({ ...prev, open: false }))
  }

  return {
    dialogState,
    confirm,
    close,
    ConfirmDialog: () => (
      <ConfirmDialog
        open={dialogState.open}
        onOpenChange={(open) => {
          if (!open) close()
        }}
        title={dialogState.title}
        description={dialogState.description}
        confirmLabel={dialogState.confirmLabel}
        cancelLabel={dialogState.cancelLabel}
        variant={dialogState.variant}
        onConfirm={dialogState.onConfirm || (() => {})}
        isLoading={dialogState.isLoading}
      />
    ),
  }
}

/**
 * Example usage:
 * 
 * ```tsx
 * const { confirm, ConfirmDialog } = useConfirmDialog()
 * 
 * const handleDelete = async () => {
 *   await confirm({
 *     title: "Delete Account",
 *     description: "Are you sure you want to delete your account? This action cannot be undone.",
 *     confirmLabel: "Delete",
 *     variant: "danger",
 *     onConfirm: async () => {
 *       await deleteAccount()
 *     }
 *   })
 * }
 * 
 * return (
 *   <>
 *     <Button onClick={handleDelete}>Delete Account</Button>
 *     <ConfirmDialog />
 *   </>
 * )
 * ```
 */
