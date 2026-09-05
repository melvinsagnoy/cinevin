interface GenreBadgeProps {
  name: string
  className?: string
}

export function GenreBadge({ name, className }: GenreBadgeProps) {
  return (
    <span
      className={`inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 backdrop-blur ${className || ''}`}
    >
      {name}
    </span>
  )
}