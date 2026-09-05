'use client'

import Link from 'next/link'
import { useMyList } from '@/hooks/useMyList'

export function NavbarMyListButton() {
  const { items } = useMyList()
  const count = items.length

  return (
    <Link 
      href="/my-list"
      className="relative flex items-center gap-2 rounded p-2 text-[#b3b3b3] transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-110"
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E50914] text-xs font-bold text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
      <span className="hidden sm:inline">My List</span>
    </Link>
  )
}