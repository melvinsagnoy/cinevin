'use client'

import Link from 'next/link'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  return (
    <Link href="/" className={`font-bold transition hover:opacity-80 ${sizes[size]} ${className}`}>
      <span className="text-red-500">CINE</span>
      <span className="text-white">VIN</span>
    </Link>
  )
}