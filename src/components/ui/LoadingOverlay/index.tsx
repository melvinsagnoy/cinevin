'use client'  // ← Add this at the top

import { useEffect, useState } from 'react'
import { LoadingSpinner } from '../LoadingSpinner'
import { cn } from '@/lib/utils/cn'

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
}

export function LoadingOverlay({ isLoading, children, className }: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-[#b3b3b3] animate-pulse">Loading...</p>
          </div>
        </div>
      )}
    </div>
  )
}