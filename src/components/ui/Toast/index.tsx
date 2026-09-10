'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setToasts(prev => [...prev, { id, message, type, duration }])
    },
    []
  )

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed bottom-20 right-4 z-toast flex flex-col gap-2 md:bottom-6"
        role="status"
        aria-live="polite"
      >
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  useEffect(() => {
    if (!toast.duration) return
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  const Icon =
    toast.type === 'success'
      ? CheckCircle2
      : toast.type === 'error'
      ? XCircle
      : Info

  const iconColor =
    toast.type === 'success'
      ? 'text-emerald-400'
      : toast.type === 'error'
      ? 'text-cinevin-red'
      : 'text-cinevin-text-muted'

  return (
    <div
      className={cn(
        'flex min-w-[260px] max-w-sm items-start gap-3 rounded-lg border border-cinevin-border',
        'bg-cinevin-surface/95 px-4 py-3 shadow-2xl backdrop-blur-lg',
        'animate-toast-in'
      )}
    >
      <Icon className={cn('mt-0.5 h-4 w-4 flex-shrink-0', iconColor)} />
      <p className="flex-1 text-sm text-cinevin-text">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="rounded p-0.5 text-cinevin-text-dim transition hover:text-cinevin-text"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}