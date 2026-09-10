'use client'

import { ButtonHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { LoadingSpinner } from '../LoadingSpinner'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'light'
type Size = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading,
      onClick,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!onClick) return
      const result = onClick(e)
      if (result instanceof Promise) {
        setIsLoading(true)
        try {
          await result
        } finally {
          setIsLoading(false)
        }
      }
    }

    const variants: Record<Variant, string> = {
      primary:
        'bg-cinevin-red text-white hover:bg-cinevin-red-hover active:bg-cinevin-red-active shadow-lg shadow-cinevin-red/20',
      secondary:
        'bg-white/15 text-white hover:bg-white/25 backdrop-blur-md border border-white/10',
      outline:
        'border border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50',
      ghost:
        'bg-transparent text-cinevin-text-muted hover:bg-white/10 hover:text-cinevin-text',
      light:
        'bg-white text-cinevin-dark hover:bg-white/90 active:bg-white/80',
    }

    const sizes: Record<Size, string> = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
      icon: 'h-10 w-10 p-0',
    }

    const isDisabled = disabled || loading || isLoading

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-semibold',
          'btn-scale select-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cinevin-red',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isDisabled}
        onClick={handleClick}
        {...props}
      >
        {isLoading || loading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'