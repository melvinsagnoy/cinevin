'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bookmark, Film, Home, Search, Tv } from 'lucide-react'
import { navigation } from '@/config/navigation'
import { cn } from '@/lib/utils/cn'
import type { ComponentType } from 'react'

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  home: Home,
  film: Film,
  tv: Tv,
  search: Search,
  bookmark: Bookmark,
}

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-nav md:hidden',
        'border-t border-cinevin-border bg-cinevin-dark/95 backdrop-blur-md',
        'pb-safe'
      )}
      aria-label="Mobile navigation"
    >
      <div className="grid h-14 grid-cols-5">
        {navigation.mobile.map(item => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          const Icon = iconMap[item.icon] ?? Home

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 transition-colors',
                isActive
                  ? 'text-cinevin-red'
                  : 'text-cinevin-text-dim hover:text-white'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}