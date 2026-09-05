'use client'

import { ButtonHTMLAttributes, forwardRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { LoadingSpinner } from '../LoadingSpinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, onClick, children, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isClicked, setIsClicked] = useState(false)

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        setIsClicked(true)
        setTimeout(() => setIsClicked(false), 200)
        
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
    }

    const variants = {
      primary: 'bg-[#E50914] text-white hover:bg-[#F6121D] active:bg-[#C40812]',
      secondary: 'bg-white/20 text-white hover:bg-white/30 backdrop-blur',
      outline: 'border border-white/40 bg-transparent text-white hover:bg-white/10',
      ghost: 'bg-transparent text-white hover:bg-white/10',
    }
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    const isLoadingState = loading || isLoading
    
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 btn-scale',
          isClicked && 'scale-95',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoadingState || props.disabled}
        onClick={handleClick}
        {...props}
      >
        {isLoadingState ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'