'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  }

  return (
    <Link
      href="/"
      aria-label="Cinevin Home"
      className={cn(
        'font-black tracking-tight transition-opacity hover:opacity-90',
        sizes[size],
        className
      )}
    >
      <span className="text-cinevin-red">CINE</span>
      <span className="text-white">VIN</span>
    </Link>
  )
}