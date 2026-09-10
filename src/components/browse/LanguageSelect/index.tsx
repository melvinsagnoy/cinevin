'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { languages } from '@/config/navigation'

interface LanguageSelectProps {
  defaultValue: string
}

export function LanguageSelect({ defaultValue }: LanguageSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', value)
    // Reset to first tab when language changes
    params.delete('tab')
    router.push(`/browse-languages?${params.toString()}`)
  }

  return (
    <select
      name="lang"
      defaultValue={defaultValue}
      onChange={handleChange}
      className="rounded-md border border-cinevin-border bg-cinevin-surface px-4 py-2 text-sm text-cinevin-text-muted focus:border-cinevin-red focus:outline-none min-w-[150px]"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  )
}