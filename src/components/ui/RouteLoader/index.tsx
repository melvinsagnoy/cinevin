'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function RouteLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsLoading(true)
    setProgress(0)
    
    // Animate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + Math.random() * 10
      })
    }, 100)

    const timer = setTimeout(() => {
      setProgress(100)
      clearInterval(interval)
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 300)
    }, 500)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-[#E50914] transition-all duration-300">
      <div 
        className="h-full bg-[#F6121D] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}